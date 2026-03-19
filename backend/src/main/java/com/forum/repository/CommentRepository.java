package com.forum.repository;

import com.forum.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndParentIsNull(Long postId);
    List<Comment> findByParentId(Long parentId);
    void deleteByPostId(Long postId);
}