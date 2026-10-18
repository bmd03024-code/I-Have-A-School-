import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, Send } from 'lucide-react';
import { EDUCATIONAL_POSTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { EducationalPost } from '../types';

export const EducationalPosts: React.FC = () => {
  const { toggleBookmark, isBookmarked, showToast, searchQuery, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    EDUCATIONAL_POSTS.forEach((p: EducationalPost) => {
      initial[p.id] = p.likes;
    });
    return initial;
  });
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  const [activeCommentInput, setActiveCommentInput] = useState<Record<string, string>>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const categories = ['All', 'Exam Advice', 'English Grammar', 'Spoken Fluency', 'Motivation'];

  const filteredPosts = EDUCATIONAL_POSTS.filter((post: EducationalPost) => {
    const title = lang === 'bn' ? post.titleBn : post.titleEn;
    const excerpt = lang === 'bn' ? post.excerptBn : post.excerptEn;
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) return;
    setLikedPosts((prev) => [...prev, postId]);
    setLikesMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    showToast(lang === 'bn' ? 'পোস্টে লাইক দেওয়ার জন্য ধন্যবাদ!' : 'Liked post! Thank you for supporting Tuhin Sir.');
  };

  const handleShare = (postTitle: string) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`${lang === 'bn' ? 'লিঙ্ক কপি হয়েছে' : 'Copied article link'}: "${postTitle}"`);
  };

  const handleAddComment = (postId: string) => {
    const text = activeCommentInput[postId]?.trim();
    if (!text) return;

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text]
    }));

    setActiveCommentInput((prev) => ({
      ...prev,
      [postId]: ''
    }));

    showToast(lang === 'bn' ? 'মন্তব্য যোগ করা হয়েছে!' : 'Comment submitted! Tuhin Sir appreciates student questions.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'তুহিন স্যারের শিক্ষণীয় কলাম' : "Tuhin Sir's Classroom Column"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'শিক্ষামূলক পোস্ট, নোটস ও পরামর্শ' : 'Educational Posts, Notes & Insights'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          {lang === 'bn'
            ? 'প্রতিদিনের ব্যাকরণ টিপস, বোর্ড পরীক্ষার কৌশল এবং স্পোকেন ফ্লুয়েন্সির গুরুত্বপূর্ণ প্রবন্ধ।'
            : 'In-depth articles, grammar rules of the day, board exam tips, and spoken fluency advice published regularly.'}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post: EducationalPost) => {
          const isBookmarkedPost = isBookmarked(post.id);
          const isLiked = likedPosts.includes(post.id);
          const totalLikes = likesMap[post.id] || post.likes;
          const isExpanded = expandedPostId === post.id;
          const userComments = commentsMap[post.id] || [];
          const title = lang === 'bn' ? post.titleBn : post.titleEn;
          const excerpt = lang === 'bn' ? post.excerptBn : post.excerptEn;
          const content = lang === 'bn' ? post.contentBn : post.contentEn;

          return (
            <article
              key={post.id}
              id={post.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all space-y-5"
            >
              {/* Meta */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    TH
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{post.author}</h4>
                    <p className="text-xs text-slate-400">
                      {post.date} • {post.readTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className="p-2 text-slate-400 hover:text-emerald-600"
                    title="Bookmark article"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarkedPost ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {title}
                </h2>
                
                <p className="text-sm text-slate-600 leading-relaxed font-serif italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "{excerpt}"
                </p>

                {/* Full Content */}
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed pt-2">
                  {(isExpanded ? content : content.slice(0, 3)).map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {content.length > 3 && (
                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline pt-1"
                  >
                    {isExpanded 
                      ? (lang === 'bn' ? 'সংক্ষিপ্ত করুন' : 'Show Less') 
                      : (lang === 'bn' ? 'সম্পূর্ণ আর্টিকেল পড়ুন...' : 'Read Full Article...')}
                  </button>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {post.tags.map((t: string, i: number) => (
                    <span key={i} className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      isLiked ? 'text-rose-600' : 'hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                    <span>{totalLikes} {lang === 'bn' ? 'লাইক' : 'Likes'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount + userComments.length} {lang === 'bn' ? 'মন্তব্য' : 'Comments'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleShare(title)}
                  className="flex items-center gap-1 hover:text-emerald-600 font-medium"
                >
                  <Share2 className="w-4 h-4" /> {lang === 'bn' ? 'শেয়ার লিঙ্ক' : 'Share Link'}
                </button>
              </div>

              {/* Interactive Student Comments Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'স্যারকে প্রশ্ন করুন বা মতামত দিন...' : 'Ask Sir a question or leave a note...'}
                    value={activeCommentInput[post.id] || ''}
                    onChange={(e) => setActiveCommentInput({ ...activeCommentInput, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> {lang === 'bn' ? 'পাঠান' : 'Post'}
                  </button>
                </div>

                {userComments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {userComments.map((comment: string, ci: number) => (
                      <div key={ci} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold text-slate-900 block text-[11px]">{lang === 'bn' ? 'শিক্ষার্থীর প্রশ্ন:' : 'Student Query:'}</span>
                        <p className="mt-0.5">{comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
