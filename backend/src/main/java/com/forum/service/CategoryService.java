package com.forum.service;

import com.forum.dto.CategoryDTO;
import com.forum.model.Category;
import com.forum.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private static final String DEFAULT_CATEGORY_NAME = "General";
    private static final String DEFAULT_CATEGORY_SLUG = "general";

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category getOrCreateDefaultCategory() {
        return categoryRepository.findBySlug(DEFAULT_CATEGORY_SLUG)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(DEFAULT_CATEGORY_NAME)
                        .description("Default topic for posts that do not need a dedicated category.")
                        .slug(DEFAULT_CATEGORY_SLUG)
                        .build()));
    }

    public CategoryDTO createCategory(String name, String description) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .slug(name.toLowerCase().replace(" ", "-"))
                .build();
        category = categoryRepository.save(category);
        return CategoryDTO.fromEntity(category);
    }
}
