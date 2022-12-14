import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import ProductRepository from '../typeorm/repositories/ProductRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    // prepara para salvar
    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    // salva no banco de dados
    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
