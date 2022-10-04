import { GetServerSideProps } from 'next';
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';
import spotifyLogo from '../assets/spotify-logo.png';

interface Props {
	providers: Awaited<ReturnType<typeof getProviders>>;
}

const Login = ({ providers }: Props) => {
	const { name: providerName, id: providerId } =
		providers?.spotify as ClientSafeProvider;

	return (
		<div className="flex flex-col justify-center items-center bg-black h-screen">
			<div className="mb-6">
				<Image
					src={spotifyLogo}
					alt="Spotify logo"
					height="200px"
					width="200px"
				/>
			</div>
			<button
				className="bg-[#1bd860] text-white rounded-full p-5"
				onClick={() => {
					signIn(providerId, { callbackUrl: '/' });
				}}
			>
				Login with Spotify
			</button>
		</div>
	);
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
};
