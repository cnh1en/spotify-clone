import { useSession } from 'next-auth/react';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { playlistReducer } from '../reducers/playlistReducer';
import {
	IPlaylistContext,
	PlaylistContextState,
	PlaylistReducerActionType,
} from '../types';

const defaultPlaylistContextState: PlaylistContextState = {
	playlists: [],
	selectedPlaylistId: null,
	selectedPlaylist: null,
	isShuffle: false,
};

export const PlaylistContext = createContext<IPlaylistContext>({
	playlistContextState: defaultPlaylistContextState,
	dispatchPlaylistAction: () => {},
});

export const usePlaylistContext = () => useContext(PlaylistContext);

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
	const { data: session } = useSession();
	const spotifyApi = useSpotify();

	const [playlistContextState, dispatchPlaylistAction] = useReducer(
		playlistReducer,
		defaultPlaylistContextState
	);
	useEffect(() => {
		const getUserPlaylists = async () => {
			const userPlaylistResponse = await spotifyApi.getUserPlaylists();
			console.log('Playlists: ', userPlaylistResponse.body.items);

			dispatchPlaylistAction({
				type: PlaylistReducerActionType.SetPlaylist,
				payload: {
					playlists: userPlaylistResponse.body.items,
				},
			});
		};

		if (spotifyApi.getAccessToken()) {
			getUserPlaylists();
		}
	}, [session, spotifyApi]);

	const playlistContextProviderData = {
		playlistContextState,
		dispatchPlaylistAction,
	};

	return (
		<PlaylistContext.Provider value={playlistContextProviderData}>
			{children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
