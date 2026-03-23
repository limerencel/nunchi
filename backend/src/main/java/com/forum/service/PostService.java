package com.forum.service;

import com.forum.dto.CreatePostRequest;
import com.forum.dto.PostDTO;
import com.forum.model.Category;
import com.forum.model.Post;
import com.forum.model.User;
import com.forum.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final AuthService authService;

    public Page<PostDTO> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable).map(PostDTO::fromEntity);
    }

    public Page<PostDTO> getPostsByCategory(Long categoryId, Pageable pageable) {
        return postRepository.findByCategoryId(categoryId, pageable)
                .map(PostDTO::fromEntity);
    }

    public Page<PostDTO> searchPosts(String query, Pageable pageable) {
        return postRepository.searchPosts(query, pageable)
                .map(PostDTO::fromEntity);
    }

    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return PostDTO.fromEntityWithComments(post);
    }

    @Transactional
    public PostDTO createPost(CreatePostRequest request, String username) {
        User user = authService.getUserByUsername(username);
        Category category = request.getCategoryId() != null
                ? categoryService.getCategoryById(request.getCategoryId())
                : categoryService.getOrCreateDefaultCategory();

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .category(category)
                .build();

        post = postRepository.save(post);
        return PostDTO.fromEntity(post);
    }

    @Transactional
    public PostDTO updatePost(Long id, CreatePostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        
        if (request.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(request.getCategoryId());
            post.setCategory(category);
        }

        post = postRepository.save(post);
        return PostDTO.fromEntity(post);
    }

    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }
}
