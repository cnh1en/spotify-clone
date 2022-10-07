import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	RewindIcon,
	VolumeOffIcon,
	VolumeUpIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import { ChangeEventHandler } from 'react';
import { useSongContext } from '../context/SongContext';
import { useSpotify } from '../hooks/useSpotify';
import { SongReducerActionType } from '../types';

const Player = () => {
	const spotifyApi = useSpotify();

	const {
		dispatchSongAction,
		songContextState: { isPlaying, selectedSong, deviceId, volume },
	} = useSongContext();

	const handlePlayPause = async () => {
		// Need premium account
		const response = await spotifyApi.getMyCurrentPlaybackState();

		if (!response.body) return;
		if (response.body.is_playing) {
			await spotifyApi.pause();
			dispatchSongAction({
				type: SongReducerActionType.TogglePlaying,
				payload: false,
			});
		} else {
			await spotifyApi.play();
			dispatchSongAction({
				type: SongReducerActionType.TogglePlaying,
				payload: true,
			});
		}
	};

	const handleSkipSong = async (skip: 'previous' | 'next') => {
		if (!deviceId) return;

		if (skip === 'previous') {
			await spotifyApi.skipToPrevious();
		} else {
			await spotifyApi.skipToNext();
		}

		const song = await spotifyApi.getMyCurrentPlayingTrack();

		dispatchSongAction({
			type: SongReducerActionType.SetCurrentPlayingSong,
			payload: {
				selectedSongId: song.body.item?.id,
				selectedSong: song.body.item as SpotifyApi.TrackObjectFull,
				isPlaying: song.body.is_playing,
			},
		});
	};

	const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		const volume = Number(event.target.value);
		await spotifyApi.setVolume(Number(volume));

		dispatchSongAction({
			type: SongReducerActionType.SetVolumeSong,
			payload: volume,
		});
	};

	const handleMute = async (handle: 'mute' | 'on') => {
		let volume;
		if (handle === 'mute') volume = 0;
		else volume = 100;

		await spotifyApi.setVolume(volume);

		dispatchSongAction({
			type: SongReducerActionType.SetVolumeSong,
			payload: volume,
		});
	};

	return (
		<div className="h-24 bg-gradient-to-b from-black to bg-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			<div className="flex items-center space-x-4">
				{selectedSong && (
					<>
						<div className="hidden md:block">
							<Image
								src={selectedSong.album.images[0].url || ''}
								alt="song"
								width={50}
								height={50}
							/>
						</div>

						<div>
							<p className="truncate w-30">{selectedSong.album.name}</p>
							<p className="truncate w-30 text-gray-500">
								{selectedSong.artists.map((item) => item.name).join(', ')}
							</p>
						</div>
					</>
				)}
			</div>
			<div className="flex justify-evenly items-center">
				<RewindIcon
					className="icon-play"
					onClick={() => handleSkipSong('previous')}
				/>
				{!isPlaying ? (
					<PlayIcon className="icon-play" onClick={handlePlayPause} />
				) : (
					<PauseIcon className="icon-play" onClick={handlePlayPause} />
				)}
				<FastForwardIcon
					className="icon-play"
					onClick={() => handleSkipSong('next')}
				/>
			</div>

			<div className="flex justify-end pr-5 space-x-3 md:space-x-4 items-center">
				{volume ? (
					<VolumeUpIcon
						className="w-4 h-4 cursor-pointer"
						onClick={() => handleMute('mute')}
					/>
				) : (
					<VolumeOffIcon
						className="w-4 h-4 cursor-pointer"
						onClick={() => handleMute('on')}
					/>
				)}
				<input
					type="range"
					min={0}
					max={100}
					value={volume}
					onChange={handleVolumeChange}
					className="cursor-pointer"
				/>
			</div>
		</div>
	);
};

export default Player;
