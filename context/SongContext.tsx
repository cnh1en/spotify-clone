import { useSession } from 'next-auth/react';
import {
	createContext,
	useContext,
	ReactNode,
	useReducer,
	useEffect,
} from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { songReducer } from '../reducers/songReducer';
import {
	ISongContext,
	SongContextState,
	SongReducerActionType,
} from '../types';

const defaultSongContextState: SongContextState = {
	selectedSongId: undefined,
	selectedSong: null,
	isPlaying: false,
	deviceId: null,
	volume: 50,
	repeat: false,
};

export const SongContext = createContext<ISongContext>({
	songContextState: defaultSongContextState,
	dispatchSongAction: () => {},
});

export const useSongContext = () => useContext(SongContext);

const SongContextProvider = ({ children }: { children: ReactNode }) => {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();

	const [songContextState, dispatchSongAction] = useReducer(
		songReducer,
		defaultSongContextState
	);

	const songContextProviderData = {
		songContextState,
		dispatchSongAction,
	};

	useEffect(() => {
		const setCurrentDevice = async () => {
			const availableDevicesResponse = await spotifyApi.getMyDevices();
			console.log('AVAILABLE DEVICE: ', availableDevicesResponse);
			if (!availableDevicesResponse) return;

			const { id, volume_percent } = availableDevicesResponse.body.devices[0];

			dispatchSongAction({
				type: SongReducerActionType.SetDevice,
				payload: {
					deviceId: id,
					volume: volume_percent as number,
				},
			});

			await spotifyApi.transferMyPlayback([id as string]);
		};

		if (spotifyApi.getAccessToken()) {
			setCurrentDevice();
		}
	}, [spotifyApi, session]);

	useEffect(() => {
		const getCurrentPlayingSong = async () => {
			const songInfo = await spotifyApi.getMyCurrentPlayingTrack();

			if (!songInfo.body) return;

			dispatchSongAction({
				type: SongReducerActionType.SetCurrentPlayingSong,
				payload: {
					isPlaying: songInfo.body.is_playing,
					selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
					selectedSongId: songInfo.body.item?.id,
				},
			});
		};

		if (spotifyApi.getAccessToken()) {
			getCurrentPlayingSong();
		}
	}, [spotifyApi, session]);

	return (
		<SongContext.Provider value={songContextProviderData}>
			{children}
		</SongContext.Provider>
	);
};

export default SongContextProvider;
