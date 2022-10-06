import {
	HeartIcon,
	HomeIcon,
	LibraryIcon,
	PlusCircleIcon,
	RssIcon,
	SearchIcon,
} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { useSpotify } from '../hooks/useSpotify';
import IconButton from './IconButton';
import SpotifyLogo from './icons/Spotify';

const Divider = () => <hr className="border-t-[0.1px] border-gray-900" />;

const Sidebar = () => {
	const { data } = useSession();

	const spotifyApi = useSpotify();

	const {
		playlistContextState: { playlists },
		updatePlaylistContextState,
	} = usePlaylistContext();

	const setSelectedPlaylist = async (id: string) => {
		const playlistResponse = await spotifyApi.getPlaylist(id);

		updatePlaylistContextState({
			selectedPlaylistId: id,
			selectedPlaylist: playlistResponse.body,
		});

		console.log('PLAYLIST ID: ', playlistResponse.body.name);
	};

	return (
		<div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-auto sm:max-[12rem] lg:max-w-[15rem] hidden md:block scrollbar-hidden">
			<div className="space-y-8">
				<SpotifyLogo color="white" className="h-10 max-w-[131px] w-full" />
				<div className="space-y-4">
					<IconButton icon={HomeIcon} label="Home" />
					<IconButton icon={SearchIcon} label="Search" />
					<IconButton icon={LibraryIcon} label="Your Library" />

					<Divider />

					<IconButton icon={PlusCircleIcon} label="Create Playlist" />
					<IconButton icon={HeartIcon} label="Liked Songs" />
					<IconButton icon={RssIcon} label="Your episodes" />

					<Divider />

					{playlists.map(({ id, name }) => (
						<p
							key={id}
							className="cursor-pointer hover:text-white"
							onClick={() => setSelectedPlaylist(id)}
						>
							{name}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
