package com.forum.dto;

import com.forum.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private String username;
    private String userAvatar;
    private Long categoryId;
    private String categoryName;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> comments;

    public static PostDTO fromEntity(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUser().getId())
                .username(post.getUser().getUsername())
                .userAvatar(post.getUser().getAvatar())
                .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                .categoryName(post.getCategory() != null ? post.getCategory().getName() : null)
                .viewCount(post.getViewCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public static PostDTO fromEntityWithComments(Post post) {
        PostDTO dto = fromEntity(post);
        if (post.getComments() != null) {
            dto.setComments(post.getComments().stream()
                    .map(CommentDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
