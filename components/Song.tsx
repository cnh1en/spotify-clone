import Image from 'next/image';
import React from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { useSongContext } from '../context/SongContext';
import { useSpotify } from '../hooks/useSpotify';
import { SongReducerActionType } from '../types';
import { convertTime } from '../utils/convertTime';
import Player from './Player';

interface ISong {
	item: SpotifyApi.PlaylistTrackObject;
	itemIndex: number;
	src: string;
}

const Song = ({ item: { track }, itemIndex, src }: ISong) => {
	console.log('TRACK: ', track);

	const spotifyApi = useSpotify();

	const {
		songContextState: { deviceId },
		dispatchSongAction,
	} = useSongContext();

	const {
		playlistContextState: { selectedPlaylist },
	} = usePlaylistContext();

	const handlePlaySong = async () => {
		if (!deviceId) return;

		dispatchSongAction({
			type: SongReducerActionType.SetCurrentPlayingSong,
			payload: {
				selectedSong: track,
				selectedSongId: track?.id,
				isPlaying: true,
			},
		});

		await spotifyApi.play({
			device_id: deviceId,
			context_uri: selectedPlaylist?.uri,
			offset: {
				uri: track?.uri as string,
			},
		});
	};

	return (
		<div
			className="text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer"
			onClick={handlePlaySong}
		>
			<div className="flex items-center space-x-5">
				<Image
					src={track?.album.images[0].url || ''}
					alt="track cover"
					height="40px"
					width="40px"
				/>
				<div className="flex flex-col text-[15px] w-36 lg:w-[480px]">
					<span className="text-white truncate w-50">{track?.name}</span>
					<span className="truncate">
						{track?.artists.map((item) => item.name).join(', ')}
					</span>
				</div>

				<div className="flex-grow flex justify-between items-center mr-auto md:ml-0">
					<p className="hidden md:block w-64 truncate">{track?.album.name}</p>
					<p>{convertTime(Number(track?.duration_ms))}</p>
				</div>
			</div>
		</div>
	);
};

export default Song;
