import {
	PlaylistContextState,
	PlaylistReducerAction,
	PlaylistReducerActionType,
} from '../types';

export const playlistReducer = (
	state: PlaylistContextState,
	action: PlaylistReducerAction
) => {
	switch (action.type) {
		case PlaylistReducerActionType.SetPlaylist:
			return {
				...state,
				...action.payload,
			};

		case PlaylistReducerActionType.SetShuffle:
			return {
				...state,
				isShuffle: action.payload,
			};
		default:
			return state;
	}
};
