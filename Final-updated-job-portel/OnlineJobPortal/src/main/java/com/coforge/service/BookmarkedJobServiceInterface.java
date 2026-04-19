package com.coforge.service;

import java.util.List;

import com.coforge.entity.BookmarkedJob;

public interface BookmarkedJobServiceInterface {
	BookmarkedJob addBookmark(Long freelancerId, Long jobId, Long skillId);
	List<BookmarkedJob> getBookmarks(Long freelancerId);
}
