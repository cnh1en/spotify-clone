import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Dispatch } from 'react';

export enum TokenError {
	RefreshTokenError = 'R',
}

export interface ExtendedToken extends JWT {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: number;
	user: User;
	error?: TokenError;
}

export interface ExtendedSession extends Session {
	accessToken: ExtendedToken['accessToken'];
	error: ExtendedToken['error'];
}

export interface PlaylistContextState {
	playlists: SpotifyApi.PlaylistObjectSimplified[];
	selectedPlaylistId: string | null;
	selectedPlaylist: SpotifyApi.SinglePlaylistResponse | null;
	isShuffle: boolean;
}

export enum PlaylistReducerActionType {
	SetShuffle = 'SetShuffle',
	SetPlaylist = 'SetPlaylist',
}

export type PlaylistReducerAction =
	| {
			type: PlaylistReducerActionType.SetShuffle;
			payload: boolean;
	  }
	| {
			type: PlaylistReducerActionType.SetPlaylist;
			payload: Partial<PlaylistContextState>;
	  };

export interface IPlaylistContext {
	playlistContextState: PlaylistContextState;
	dispatchPlaylistAction: Dispatch<PlaylistReducerAction>;
}

export interface SongContextState {
	selectedSongId?: string;
	selectedSong: SpotifyApi.TrackObjectFull | null;
	isPlaying: boolean;
	volume: number;
	deviceId: string | null;
	repeat: 'context' | 'off' | 'track';
}

export interface ISongContext {
	songContextState: SongContextState;
	dispatchSongAction: Dispatch<SongReducerAction>;
}

export enum SongReducerActionType {
	SetDevice = 'SetDevice',
	TogglePlaying = 'ToggleIsPlaying',
	SetCurrentPlayingSong = 'SetCurrentPlayingSong',
	SetRepeatSong = 'SetRepeatSong',
	SetVolumeSong = 'SetVolumeSong',
}

export type SongReducerAction =
	| {
			type: SongReducerActionType.SetDevice;
			payload: Pick<SongContextState, 'deviceId' | 'volume'>;
	  }
	| {
			type: SongReducerActionType.TogglePlaying;
			payload: boolean;
	  }
	| {
			type: SongReducerActionType.SetCurrentPlayingSong;
			payload: Pick<
				SongContextState,
				'selectedSongId' | 'selectedSong' | 'isPlaying'
			>;
	  }
	| {
			type: SongReducerActionType.SetRepeatSong;
			payload: Pick<SongContextState, 'repeat'>;
	  }
	| {
			type: SongReducerActionType.SetVolumeSong;
			payload: number;
	  };
