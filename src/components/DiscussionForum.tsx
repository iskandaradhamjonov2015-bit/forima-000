/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserLevel, ForumPost, ForumReply } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  Heart, 
  MessageCircle, 
  ArrowLeft, 
  Send, 
  User, 
  Sparkles, 
  Hash, 
  Filter,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import confetti from 'canvas-confetti';

interface DiscussionForumProps {
  user: UserProfile;
  currentLevel: UserLevel;
}

const STORAGE_KEY = 'matematika_akademiyasi_forum';

const PRE_SEEDED_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Pifagor teoremasini isbotlashning eng oson usuli qaysi?',
    content: "Assalomu alaykum! Junior darajasida Pifagor teoremasini o'rganyapman (a² + b² = c²). Geometrik shakllar yordamida (masalan, to'rtta bir xil uchburchakni kvadrat ichiga joylashtirib) isbotlash usuli juda chiroyli ekan. Kimda yana shunga o'xshash sodda va vizual isbotlar bor? Iltimos bo'lishing!",
    authorName: 'Azizbek Solihov',
    authorLevel: UserLevel.JUNIOR,
    authorRole: 'student',
    category: 'Junior',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    likes: 8,
    replies: [
      {
        id: 'reply-1-1',
        content: "Vaalaykum assalom! Kvadrat usuli haqiqatdan ham eng soddasi. Yana bitta mashhur usul - 'Prezident Garfild' isboti deb ataladi. U bitta trapetsiyani uchta to'g'ri burchakli uchburchakka bo'lish orqali isbotlanadi. S = 1/2 * (a+b) * (a+b) formulasidan juda oson algebraik qisqarishlar bilan chiqadi. Qidirib ko'ring, juda qiziq!",
        authorName: 'Jasur Ahmedov (O\'qituvchi)',
        authorRole: 'teacher',
        createdAt: Date.now() - 20 * 60 * 60 * 1000,
        likes: 5
      },
      {
        id: 'reply-1-2',
        content: "Sifatli va qiziqarli savol! Shu mavzuni darslarimizdagi 'Geometrik shakllar' darsida video formatda ham tushuntirganmiz, o'sha yerdan ham ko'rishingiz mumkin.",
        authorName: 'Olima Opa (Matematika)',
        authorRole: 'teacher',
        createdAt: Date.now() - 18 * 60 * 60 * 1000,
        likes: 4
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Nega nolinchi darajada har qanday son (0 dan tashqari) 1 ga teng bo\'ladi?',
    content: "Salom barchaga! x^0 = 1 bo'lishini bilamiz. Lekin bu qoidani tub mohiyatini qisqacha tushuntirib bera oladiganlar bormi? Nega aynan 1, nega 0 emas?",
    authorName: 'Malika Karimova',
    authorLevel: UserLevel.SENIOR,
    authorRole: 'student',
    category: 'Senior',
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    likes: 12,
    replies: [
      {
        id: 'reply-2-1',
        content: "Buni ko'rsatkichli sonlarning bo'lish qonuniyati orqali tushunish juda oson. Masalan: x^n / x^n = 1 bo'lishini bilamiz (chunki sonni o'ziga bo'lsak 1 ga teng). Ikkinchi tomondan, darajalar qoidasiga ko'ra ax/ay = a^(x-y). Shunday qilib, x^n / x^n = x^(n-n) = x^0. Teorema isbotlandi: x^0 = 1",
        authorName: 'Olima Opa (Matematika)',
        authorRole: 'teacher',
        createdAt: Date.now() - 10 * 60 * 60 * 1000,
        likes: 9
      },
      {
        id: 'reply-2-2',
        content: "Vay, ajoyib isbot! Shu paytgacha faqat yodlab olgan edim, hozir mohiyatini tushundim. Rahmat o'qituvchi!",
        authorName: 'Jasurbek Soliyev',
        authorRole: 'student',
        createdAt: Date.now() - 8 * 60 * 60 * 1000,
        likes: 2
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Hosilaning amaliy hayotdagi qo\'llanilishiga misollar bormi?',
    content: "Oliy matematikaning Master modulidagi 'Kombinatorika va Hosilalar' darsini o'rganyapmiz. Hosila (Limits and Derivatives) faqat nazariyada bormi yoki uni fizikada va muhandislikda qanday muhim vazifalari bor?",
    authorName: 'Sardorbek Kamilov',
    authorLevel: UserLevel.MASTER,
    authorRole: 'student',
    category: 'Master',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    likes: 15,
    replies: [
      {
        id: 'reply-3-1',
        content: "Hosilaning eng asosiy amaliy vazifasi judayam ko'p! Eng oddiysi - tezlik va tezlanish. Masofaning vaqt bo'yicha hosilasi lahzali tezlik hisoblanadi ( v(t) = s'(t) ). Shuningdek, iqtisodiyotda 'marjinal foyda'ni hisoblashda va sun'iy intellektda xatolik burchagini kamaytirish (Gradient Descent) algoritmlarida to'liq hosiladan foydalaniladi.",
        authorName: 'Jasur Ahmedov (O\'qituvchi)',
        authorRole: 'teacher',
        createdAt: Date.now() - 22 * 60 * 60 * 1000,
        likes: 11
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Tayoqni kesish haqidagi mantiqiy masala sirini tushunmadim',
    content: "Mantiqiy masalalardagi '10 metrli tayoqni 1 minutadan kessak...' degan savolda nega javob 9 bo'ladi? Uni 10 ga bo'ganda 10 metr chiqmasligi kerakmi?",
    authorName: 'Nilufar Oripova',
    authorLevel: UserLevel.JUNIOR,
    authorRole: 'student',
    category: 'Mantiqiy masalalar',
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    likes: 6,
    replies: [
      {
        id: 'reply-4-1',
        content: "Fikr qilib ko'ring: Masalan, uzunligi 2 metr bo'lgan tayoqni 1 metrdan kesmoqchisiz. Buning uchun nechta kesish kifoya? 1 marta! Chunki o'rtasidan kessangiz, avtomatik ravishda chapda 1 metr, o'ngda 1 metr bo'lib 2 ta qism bo'ladi. Xuddi shunday, oxirgi 9-kesimda tayoqning oxirgi 2 metrlik qismi kesilib, 9- va 10-metrlar bir paytda hosil bo'ladi. Kopincha adashtiradigan juda qiziqarli mantiq!",
        authorName: 'Sardorbek Kamilov',
        authorRole: 'student',
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        likes: 6
      }
    ]
  }
];

export default function DiscussionForum({ user, currentLevel }: DiscussionForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showAddPost, setShowAddPost] = useState(false);

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Umumiy');
  const [newRole, setNewRole] = useState<'student' | 'teacher'>('student');

  // New Reply Input
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRE_SEEDED_POSTS));
      setPosts(PRE_SEEDED_POSTS);
    }
  }, []);

  const savePostsToStore = (updatedPosts: ForumPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      content: newContent,
      authorName: user.name,
      authorLevel: user.level,
      authorRole: newRole,
      category: newCategory,
      createdAt: Date.now(),
      likes: 0,
      replies: []
    };

    const updated = [newPost, ...posts];
    savePostsToStore(updated);
    
    // Reset Form
    setNewTitle('');
    setNewContent('');
    setShowAddPost(false);

    confetti({
      particleCount: 40,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = posts.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByUser;
        return {
          ...p,
          likedByUser: liked,
          likes: liked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    });
    savePostsToStore(updated);
    if (selectedPost && selectedPost.id === postId) {
      const activePost = updated.find(p => p.id === postId);
      if (activePost) setSelectedPost(activePost);
    }
  };

  const handleLikeReply = (postId: string, replyId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: p.replies.map(r => {
            if (r.id === replyId) {
              const liked = !r.likedByUser;
              return {
                ...r,
                likedByUser: liked,
                likes: liked ? r.likes + 1 : r.likes - 1
              };
            }
            return r;
          })
        };
      }
      return p;
    });
    savePostsToStore(updated);
    const activePost = updated.find(p => p.id === postId);
    if (activePost) setSelectedPost(activePost);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPost) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      content: replyText,
      authorName: user.name + (newRole === 'teacher' ? ' (O\'qituvchi)' : ''),
      authorRole: newRole,
      createdAt: Date.now(),
      likes: 0
    };

    const updated = posts.map(p => {
      if (p.id === selectedPost.id) {
        return {
          ...p,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    });

    savePostsToStore(updated);
    const activePost = updated.find(p => p.id === selectedPost.id);
    if (activePost) {
      setSelectedPost(activePost);
    }
    setReplyText('');
  };

  const categories = ['Barchasi', 'Junior', 'Senior', 'Master', 'Mantiqiy masalalar', 'Umumiy'];

  // Filter & Search Logic
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Akademik Munozara Forumi</h2>
          <p className="text-slate-500 font-semibold text-sm">Masalalar yechimi, tushunarsiz formulalar va javoblar almashinuvi</p>
        </div>

        {!selectedPost && (
          <button
            onClick={() => setShowAddPost(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <PlusCircle size={16} /> Savol berish
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedPost ? (
          /* SINGLE POST VIEW (DETAIL & REPLIES) */
          <motion.div
            key="post-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black tracking-widest text-[10px] uppercase transition-colors"
            >
              <ArrowLeft size={16} /> Forum ro'yxatiga qaytish
            </button>

            {/* Core Post Card */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600">
                    {selectedPost.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{selectedPost.authorName}</span>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                        selectedPost.authorRole === 'teacher' ? "bg-amber-500 text-white" : "bg-indigo-50 text-indigo-600"
                      )}>
                        {selectedPost.authorRole === 'teacher' ? "O'qituvchi" : `${selectedPost.authorLevel} o'quvchi`}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(selectedPost.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide">
                  {selectedPost.category}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedPost.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center gap-6">
                <button
                  onClick={() => handleLikePost(selectedPost.id)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-bold transition-all",
                    selectedPost.likedByUser ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                  )}
                >
                  <Heart size={18} fill={selectedPost.likedByUser ? "currentColor" : "none"} />
                  <span>{selectedPost.likes} foydali deb topdi</span>
                </button>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                  <MessageCircle size={18} />
                  <span>{selectedPost.replies.length} ta fikr-mulohaza</span>
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" size={18} /> Munozara darsligi ({selectedPost.replies.length})
              </h4>

              {selectedPost.replies.length === 0 ? (
                <div className="bg-slate-100/50 p-8 rounded-3xl text-center font-bold text-slate-400">
                  Hali hech kim javob yozmadi. Birinchi bo'lib o'z fikringiz va yechimingiz bilan yordam bering!
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPost.replies.map((reply) => (
                    <div key={reply.id} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                            reply.authorRole === 'teacher' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {reply.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{reply.authorName}</span>
                              {reply.authorRole === 'teacher' && (
                                <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Mudarris</span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{new Date(reply.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLikeReply(selectedPost.id, reply.id)}
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all",
                            reply.likedByUser ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400 hover:text-rose-500"
                          )}
                        >
                          <Heart size={14} fill={reply.likedByUser ? "currentColor" : "none"} />
                          <span>{reply.likes}</span>
                        </button>
                      </div>

                      <p className="text-slate-600 font-semibold text-sm leading-relaxed whitespace-pre-wrap pl-1">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-extrabold text-slate-800">Ushbu mavzuda o'z mulohazangizni yoki yechimingizni yozing:</label>
                
                {/* Simulated role toggle to experience student or teacher viewpoints */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold">Rolingiz:</span>
                  <button
                    type="button"
                    onClick={() => setNewRole('student')}
                    className={cn("px-2.5 py-1 rounded-lg border", newRole === 'student' ? "bg-indigo-600 border-indigo-600 text-white font-extrabold" : "bg-white text-slate-400 font-semibold")}
                  >
                    O'quvchi
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('teacher')}
                    className={cn("px-2.5 py-1 rounded-lg border", newRole === 'teacher' ? "bg-amber-500 border-amber-500 text-white font-extrabold" : "bg-white text-slate-400 font-semibold")}
                  >
                    Mudarris
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Yechimning qisqacha isboti yoki foydali havolasini kiriting..."
                  rows={3}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none text-sm placeholder:text-slate-300 transition-all font-medium pr-12"
                  required
                />
                
                <button
                  type="submit"
                  className="absolute right-3 bottom-4 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* POSTS LIST VIEW */
          <motion.div
            key="forum-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search and Categorization */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mavzular yoki mualif bo'yicha qidirish..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 focus:bg-white text-sm font-medium border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              {/* Tag navigation */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none unique-scroll">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all",
                      selectedCategory === cat 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white p-12 rounded-[32px] border border-slate-100 text-center space-y-3 shadow-inner">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                    <HelpCircle size={24} />
                  </div>
                  <h4 className="font-extrabold text-slate-800">Mavzular Topilmadi</h4>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
                    Qidiruv so'rovi bo'yicha hech qanday natija chiqib kelyapti. Kategoriyalarni almashtiring yoki yangi savol yarating!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group bg-white p-6 rounded-[32px] border border-slate-50 hover:border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left space-y-4"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center",
                            post.authorRole === 'teacher' ? "bg-amber-100 text-amber-700" : "bg-indigo-50 text-indigo-600"
                          )}>
                            {post.authorName.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-600">{post.authorName}</span>
                          <span className="text-slate-300 font-bold">•</span>
                          <span className="text-slate-400 font-semibold">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {post.category}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-slate-400 font-semibold text-xs line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 pt-2 border-t border-slate-50 text-xs font-bold text-slate-400">
                        <button
                          onClick={(e) => handleLikePost(post.id, e)}
                          className={cn(
                            "flex items-center gap-1.5 transition-all text-xs",
                            post.likedByUser ? "text-rose-500 font-black" : "hover:text-rose-500"
                          )}
                        >
                          <Heart size={15} fill={post.likedByUser ? "currentColor" : "none"} />
                          <span>{post.likes}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-xs">
                          <MessageCircle size={15} />
                          <span>{post.replies.length} ta yechimlar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Post Dialog Modal */}
      <AnimatePresence>
        {showAddPost && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[40px] max-w-lg w-full p-8 shadow-2xl relative space-y-6"
            >
              <button
                type="button"
                onClick={() => setShowAddPost(false)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-50"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <PlusCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Yangi Savol / Mavzu Yo'llash</h3>
                  <p className="text-xs text-slate-400 font-semibold">Boshqalarga yechimda yordam bering yoki yordam so'rang</p>
                </div>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Savol sarlavhasi</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Masalan: Logarifmik tenglamalarda pi qatnashganda qanday hisoblanadi?"
                    className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white text-sm focus:border-indigo-600 focus:outline-none transition-all font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kategoriya</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-xs font-bold focus:outline-none text-slate-600"
                    >
                      <option value="Junior">Junior (Oson)</option>
                      <option value="Senior">Senior (O'rta)</option>
                      <option value="Master">Master (Qiyin)</option>
                      <option value="Mantiqiy masalalar">Mantiqiy masalalar</option>
                      <option value="Umumiy">Umumiy suhbat</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Rolingizni tanglang</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-xs font-bold focus:outline-none text-slate-600"
                    >
                      <option value="student">O'quvchi</option>
                      <option value="teacher">Mudarris / Ustoz</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Batafsil matn / Savol mazmuni</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Savolingiz matnini yoki masalani to'liq bu yerga yozing. Formulalarni aniq qilib kiritsangiz boshqalar osonroq javob beradi..."
                    rows={4}
                    className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white text-sm focus:border-indigo-600 focus:outline-none transition-all font-medium"
                    required
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddPost(false)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-xs text-slate-600 uppercase tracking-widest transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    Joylashtirish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
