import {
	SongContextState,
	SongReducerAction,
	SongReducerActionType,
} from '../types';

export const songReducer = (
	state: SongContextState,
	action: SongReducerAction
) => {
	switch (action.type) {
		case SongReducerActionType.SetDevice:
			return {
				...state,
				deviceId: action.payload.deviceId,
				volume: action.payload.volume,
			};

		case SongReducerActionType.TogglePlaying:
			return {
				...state,
				isPlaying: action.payload,
			};

		case SongReducerActionType.SetCurrentPlayingSong:
			const { selectedSong, selectedSongId, isPlaying } = action.payload;
			return {
				...state,
				selectedSong,
				selectedSongId,
				isPlaying,
			};

		case SongReducerActionType.SetVolumeSong:
			return { ...state, volume: action.payload };
		default:
			return state;
	}
};
