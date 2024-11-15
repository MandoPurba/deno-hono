import { CREATE_CLIENT_DTO } from '../../dtos/client.dto.ts';
import { Client } from '../../entities/client.entity.ts';
import { IClientRepository } from '../../repositories/client.repository.ts';
import { IBaseUseCase } from '../types/base.usecase.d.ts';

export class CreateClientUseCase implements IBaseUseCase<CREATE_CLIENT_DTO, Client> {
    constructor(private readonly clientRepository: IClientRepository) {}
    async execute(dto: CREATE_CLIENT_DTO): Promise<Client> {
        const client = await this.clientRepository.create(dto);

        const { clientSecret } = client;

        return {
            ...client,
            clientSecret,
        };
    }
}
