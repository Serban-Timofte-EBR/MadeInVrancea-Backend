import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { slugify } from '../../common/utils/slugify';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ order: { name: 'ASC' } });
  }

  /** Returns the categories nested as a two-level tree (parents with children). */
  async findTree(): Promise<Category[]> {
    const roots = await this.categoriesRepository.find({
      where: { parentId: IsNull() },
      relations: { children: true },
      order: { name: 'ASC' },
    });
    return roots;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { categoryId: id },
      relations: { children: true, parent: true },
    });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: { children: true },
    });
    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    await this.ensureSlugAvailable(slug);

    if (dto.parentId) {
      await this.findOne(dto.parentId);
    }

    const category = this.categoriesRepository.create({
      name: dto.name,
      slug,
      parentId: dto.parentId ?? null,
      iconURL: dto.iconURL ?? null,
    });
    return this.categoriesRepository.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.slug || dto.name) {
      const nextSlug = dto.slug ? slugify(dto.slug) : slugify(dto.name!);
      if (nextSlug !== category.slug) {
        await this.ensureSlugAvailable(nextSlug);
        category.slug = nextSlug;
      }
    }

    if (dto.name !== undefined) category.name = dto.name;
    if (dto.iconURL !== undefined) category.iconURL = dto.iconURL;
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new ConflictException('A category cannot be its own parent');
      }
      if (dto.parentId) {
        await this.findOne(dto.parentId);
      }
      category.parentId = dto.parentId || null;
    }

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const existing = await this.categoriesRepository.findOne({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Category slug '${slug}' is already in use`);
    }
  }
}
