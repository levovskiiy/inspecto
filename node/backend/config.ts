import { injectable } from '@needle-di/core';
import { getPort } from 'get-port-please';

@injectable()
export class ConfigService {
	private port: number = 7812;

	async configure() {
		this.port = await getPort({ port: 7812, random: true });
	}

	get config() {
		return {
			port: this.port
		};
	}
}
