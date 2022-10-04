import { ChevronDownIcon, UserIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { pickRandomColor } from '../utils/pickRandomColor';
import Songs from './Songs';

const colors = [
	'from-indigo-500',
	'from-blue-500',
	'from-green-500',
	'from-red-500',
	'from-yellow-500',
	'from-pink-500',
	'from-purple-500',
];

const Center = () => {
	const [fromColor, setFromColor] = useState<string | null>(null);

	const {
		playlistContextState: { selectedPlaylist },
	} = usePlaylistContext();

	const { data: session } = useSession();
	console.log({ session });

	useEffect(() => {
		const color = pickRandomColor(colors);
		setFromColor(color);
	}, [selectedPlaylist?.id]);

	return (
		<div className="text-white flex-grow overflow-auto h-screen">
			<header className="absolute top-5 right-8">
				<div
					className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 px-2"
					onClick={() => signOut()}
				>
					{session?.user?.image && (
						<Image
							src={session?.user?.image}
							width="36px"
							height="36px"
							className="rounded-full"
							alt="User avatar"
						/>
					)}
					<span className="text-[13px]">{session?.user?.name}</span>
					<ChevronDownIcon className="w-4 h-4" />
				</div>
			</header>

			<section
				className={`flex items-end space-x-7 bg-gradient-to-b ${fromColor} to to-black h-80 p-8`}
			>
				{selectedPlaylist && (
					<>
						<Image
							src={selectedPlaylist?.images?.[0].url}
							alt="Playlist Image"
							height="176px"
							width="176px"
							className="shadow-2xl"
						/>
						<div>
							Playlist
							<h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
								{selectedPlaylist.name}
							</h1>
						</div>
					</>
				)}
			</section>

			<Songs />
		</div>
	);
};

export default Center;
