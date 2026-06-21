<script setup lang="ts">
import { BookOpen, Clock, Users, Star, ArrowRight, Sparkles, Play, Shield, Zap, Award, Target, Menu, X, ChevronRight, Code, Palette, BarChart3, Smartphone, Wrench } from 'lucide-vue-next'
</script>

<template>
  <div class="edu-platform min-h-screen bg-white">
    <!-- ===== Navbar (Fixed, Clay Card) ===== -->
    <nav class="fixed top-4 left-4 right-4 z-50">
      <div class="clay-card px-6 py-4 max-w-6xl mx-auto bg-white">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a href="#" class="flex items-center gap-2 cursor-pointer">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--primary); border: 3px solid var(--text)">
              <BookOpen class="w-5 h-5" style="color: var(--text)" stroke-width="2.5" />
            </div>
            <span class="text-xl font-bold" style="color: var(--text)">LearnHub</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-6">
            <a href="#courses" class="text-sm font-semibold hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">Courses</a>
            <a href="#" class="text-sm font-semibold hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">Teachers</a>
            <a href="#" class="text-sm font-semibold hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">Pricing</a>
            <a href="#" class="text-sm font-semibold hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">About</a>
          </div>

          <!-- Desktop CTA -->
          <div class="hidden md:flex items-center gap-3">
            <button class="px-4 py-2 text-sm font-semibold hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text)">Log In</button>
            <button class="btn-primary text-sm py-2 px-4" style="padding-top: 0.5rem; padding-bottom: 0.5rem">Start Free</button>
          </div>

          <!-- Mobile Toggle -->
          <button class="md:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer" style="background: var(--secondary); border: 3px solid var(--text)" aria-label="Toggle menu">
            <Menu class="w-5 h-5" style="color: var(--text)" stroke-width="2.5" />
          </button>
        </div>
      </div>
    </nav>

    <!-- ===== Hero Section ===== -->
    <section class="pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 overflow-hidden" style="background: var(--bg-cream)">
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <!-- Left -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6" style="background: var(--accent-mint); border: 3px solid var(--text)">
              <span class="w-2 h-2 rounded-full" style="background: var(--cta)"></span>
              New: AI-Powered Learning
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style="color: var(--text)">
              Learn Anything,<br/>
              <span style="color: var(--cta)">Anytime</span>,<br/>
              Anywhere!
            </h1>

            <p class="text-lg mb-8 max-w-md mx-auto lg:mx-0" style="color: var(--text-muted)">
              Join millions of learners worldwide. Access 10,000+ courses taught by expert instructors.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button class="btn-primary text-base">
                Start Learning Free
                <ArrowRight class="w-5 h-5 ml-2" stroke-width="2.5" />
              </button>
              <button class="btn-secondary text-base">Browse Courses</button>
            </div>

            <div class="flex gap-6 sm:gap-8 justify-center lg:justify-start">
              <div class="text-center">
                <div class="text-2xl font-bold" style="color: var(--text)">10K+</div>
                <div class="text-sm" style="color: var(--text-muted)">Courses</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold" style="color: var(--text)">2M+</div>
                <div class="text-sm" style="color: var(--text-muted)">Students</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold" style="color: var(--text)">500+</div>
                <div class="text-sm" style="color: var(--text-muted)">Instructors</div>
              </div>
            </div>
          </div>

          <!-- Right: Floating Hero Card (desktop only) -->
          <div class="relative hidden lg:block">
            <div class="clay-card p-6 bg-white relative z-10">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: var(--secondary); border: 3px solid var(--text)">
                  <Play class="w-6 h-6" style="color: var(--text)" stroke-width="2" />
                </div>
                <div>
                  <div class="font-bold" style="color: var(--text)">Web Development</div>
                  <div class="text-sm" style="color: var(--text-muted)">12 lessons • 4h 30m</div>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span style="color: var(--text-muted)">Progress</span>
                  <span class="font-bold" style="color: var(--cta)">65%</span>
                </div>
                <div class="h-3 rounded-full border-2" style="background: var(--border); border-color: var(--text)">
                  <div class="h-full w-[65%] rounded-full" style="background: var(--cta)"></div>
                </div>
              </div>

              <button class="w-full btn-primary text-sm" style="padding-top: 0.75rem; padding-bottom: 0.75rem">Continue Learning</button>
            </div>

            <!-- Decorative floaters -->
            <div class="absolute -top-4 -right-4 z-20 w-20 h-20 rounded-2xl flex items-center justify-center" style="background: var(--primary); border: 3px solid var(--text)">
              <span class="text-3xl">🎯</span>
            </div>
            <div class="absolute -bottom-4 -left-4 z-20 w-16 h-16 rounded-2xl flex items-center justify-center" style="background: var(--accent-purple); border: 3px solid var(--text)">
              <span class="text-2xl">📚</span>
            </div>
            <div class="absolute top-1/2 -right-8 z-20 w-14 h-14 rounded-full flex items-center justify-center" style="background: var(--accent-mint); border: 3px solid var(--text)">
              <span class="text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Course Catalog ===== -->
    <section id="courses" class="py-12 sm:py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style="background: var(--secondary); border: 3px solid var(--text)">
            Popular Courses
          </span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style="color: var(--text)">Explore Top-Rated Courses</h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--text-muted)">Learn from industry experts and gain real-world skills</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Course 1 -->
          <div class="clay-card p-6 cursor-pointer bg-white">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style="background: var(--primary); border: 3px solid var(--text)">
                <Code class="w-6 h-6" stroke-width="2" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-1" style="color: var(--text)">Web Development Bootcamp</h3>
                <p class="text-sm mb-3" style="color: var(--text-muted)">by Sarah Chen</p>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <BookOpen class="w-4 h-4" stroke-width="2" /> 48 lessons
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Clock class="w-4 h-4" stroke-width="2" /> 24h
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Users class="w-4 h-4" stroke-width="2" /> 12.5K
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1 px-3 py-1 rounded-full border-2" style="background: rgba(251, 146, 60, 0.1); border-color: var(--cta)">
                <svg class="w-4 h-4" style="color: var(--cta)" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-sm font-bold" style="color: var(--cta)">4.9</span>
              </div>
            </div>
          </div>

          <!-- Course 2 -->
          <div class="clay-card p-6 cursor-pointer bg-white">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style="background: var(--secondary); border: 3px solid var(--text)">
                <Palette class="w-6 h-6" stroke-width="2" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-1" style="color: var(--text)">UI/UX Design Mastery</h3>
                <p class="text-sm mb-3" style="color: var(--text-muted)">by Mike Johnson</p>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <BookOpen class="w-4 h-4" stroke-width="2" /> 36 lessons
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Clock class="w-4 h-4" stroke-width="2" /> 18h
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Users class="w-4 h-4" stroke-width="2" /> 8.2K
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1 px-3 py-1 rounded-full border-2" style="background: rgba(251, 146, 60, 0.1); border-color: var(--cta)">
                <svg class="w-4 h-4" style="color: var(--cta)" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-sm font-bold" style="color: var(--cta)">4.8</span>
              </div>
            </div>
          </div>

          <!-- Course 3 -->
          <div class="clay-card p-6 cursor-pointer bg-white">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style="background: var(--accent-purple); border: 3px solid var(--text)">
                <BarChart3 class="w-6 h-6" stroke-width="2" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-1" style="color: var(--text)">Data Science with Python</h3>
                <p class="text-sm mb-3" style="color: var(--text-muted)">by Emily Davis</p>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <BookOpen class="w-4 h-4" stroke-width="2" /> 52 lessons
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Clock class="w-4 h-4" stroke-width="2" /> 30h
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Users class="w-4 h-4" stroke-width="2" /> 15.3K
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1 px-3 py-1 rounded-full border-2" style="background: rgba(251, 146, 60, 0.1); border-color: var(--cta)">
                <svg class="w-4 h-4" style="color: var(--cta)" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-sm font-bold" style="color: var(--cta)">4.9</span>
              </div>
            </div>
          </div>

          <!-- Course 4 -->
          <div class="clay-card p-6 cursor-pointer bg-white">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style="background: var(--accent-mint); border: 3px solid var(--text)">
                <Smartphone class="w-6 h-6" stroke-width="2" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-1" style="color: var(--text)">Mobile App Development</h3>
                <p class="text-sm mb-3" style="color: var(--text-muted)">by Alex Kim</p>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <BookOpen class="w-4 h-4" stroke-width="2" /> 42 lessons
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Clock class="w-4 h-4" stroke-width="2" /> 22h
                  </span>
                  <span class="flex items-center gap-1" style="color: var(--text-muted)">
                    <Users class="w-4 h-4" stroke-width="2" /> 9.8K
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1 px-3 py-1 rounded-full border-2" style="background: rgba(251, 146, 60, 0.1); border-color: var(--cta)">
                <svg class="w-4 h-4" style="color: var(--cta)" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-sm font-bold" style="color: var(--cta)">4.7</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-10">
          <button class="btn-secondary">
            View All Courses
            <ArrowRight class="w-5 h-5 ml-2" stroke-width="2.5" />
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Why Choose Us (4 features) ===== -->
    <section class="py-12 sm:py-20 px-4" style="background: var(--bg-cream)">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style="background: var(--primary); border: 3px solid var(--text)">Why Choose Us</span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style="color: var(--text)">Everything You Need to Succeed</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Feature 1 -->
          <div class="soft-clay p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--primary); border: 3px solid var(--text)">
              <Clock class="w-7 h-7" stroke-width="2" />
            </div>
            <h3 class="font-bold text-lg mb-2" style="color: var(--text)">Learn at Your Pace</h3>
            <p class="text-sm" style="color: var(--text-muted)">Access courses anytime, anywhere. Pause, rewind, and replay lessons as needed.</p>
          </div>

          <!-- Feature 2 -->
          <div class="soft-clay p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--secondary); border: 3px solid var(--text)">
              <Award class="w-7 h-7" stroke-width="2" />
            </div>
            <h3 class="font-bold text-lg mb-2" style="color: var(--text)">Expert Instructors</h3>
            <p class="text-sm" style="color: var(--text-muted)">Learn from industry professionals with real-world experience.</p>
          </div>

          <!-- Feature 3 -->
          <div class="soft-clay p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--accent-purple); border: 3px solid var(--text)">
              <Shield class="w-7 h-7" stroke-width="2" />
            </div>
            <h3 class="font-bold text-lg mb-2" style="color: var(--text)">Certificates</h3>
            <p class="text-sm" style="color: var(--text-muted)">Earn recognized certificates to showcase your new skills.</p>
          </div>

          <!-- Feature 4 -->
          <div class="soft-clay p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--accent-mint); border: 3px solid var(--text)">
              <Users class="w-7 h-7" stroke-width="2" />
            </div>
            <h3 class="font-bold text-lg mb-2" style="color: var(--text)">Community Support</h3>
            <p class="text-sm" style="color: var(--text-muted)">Join a community of learners. Ask questions and share knowledge.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Testimonials ===== -->
    <section class="py-12 sm:py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style="background: var(--accent-mint); border: 3px solid var(--text)">Student Stories</span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style="color: var(--text)">What Our Students Say</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Testimonial 1 -->
          <div class="clay-card p-6 bg-white">
            <div class="flex gap-1 mb-4">
              <svg v-for="n in 5" :key="n" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <p class="mb-6 leading-relaxed" style="color: var(--text-muted)">"LearnHub helped me transition from marketing to tech. The courses are well-structured and the community is incredibly supportive!"</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style="background: var(--primary); border: 3px solid var(--text)">J</div>
              <div>
                <div class="font-bold" style="color: var(--text)">Jessica Wang</div>
                <div class="text-sm" style="color: var(--text-muted)">Software Developer</div>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="clay-card p-6 bg-white">
            <div class="flex gap-1 mb-4">
              <svg v-for="n in 5" :key="n" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <p class="mb-6 leading-relaxed" style="color: var(--text-muted)">"The UI/UX course was exactly what I needed. I landed my dream job just 3 months after completing it!"</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style="background: var(--secondary); border: 3px solid var(--text)">D</div>
              <div>
                <div class="font-bold" style="color: var(--text)">David Miller</div>
                <div class="text-sm" style="color: var(--text-muted)">UX Designer</div>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="clay-card p-6 bg-white">
            <div class="flex gap-1 mb-4">
              <svg v-for="n in 5" :key="n" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <p class="mb-6 leading-relaxed" style="color: var(--text-muted)">"Best investment I've made in my career. The Python course gave me practical skills I use every day at work."</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style="background: var(--accent-purple); border: 3px solid var(--text)">M</div>
              <div>
                <div class="font-bold" style="color: var(--text)">Maria Garcia</div>
                <div class="text-sm" style="color: var(--text-muted)">Data Analyst</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA Section ===== -->
    <section class="py-12 sm:py-20 px-4" style="background: var(--secondary)">
      <div class="max-w-4xl mx-auto text-center">
        <div class="clay-card p-6 sm:p-12 bg-white">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style="color: var(--text)">Ready to Start Learning?</h2>
          <p class="text-lg mb-8 max-w-xl mx-auto" style="color: var(--text-muted)">Join over 2 million students and start your learning journey today. First 7 days are completely free!</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button class="btn-primary text-base px-8">
              Start Free Trial
              <ArrowRight class="w-5 h-5 ml-2" stroke-width="2.5" />
            </button>
            <button class="btn-secondary text-base px-8">View Pricing</button>
          </div>
          <div class="flex items-center justify-center gap-6 text-sm" style="color: var(--text-muted)">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" style="color: var(--cta)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
              <span>No credit card required</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" style="color: var(--cta)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Tool Link ===== -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-sm mb-2" style="color: var(--text-muted)">Need to test API keys?</p>
        <button
          class="btn-secondary text-sm inline-flex items-center gap-1.5"
          @click="$emit('navigate', 'apitest')"
        >
          <Wrench class="w-4 h-4" /> Open API Key Tester
        </button>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="py-10 sm:py-16 px-4" style="background: var(--bg-cream)">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <!-- Brand Column -->
          <div class="lg:col-span-2">
            <a href="#" class="flex items-center gap-2 mb-4 cursor-pointer">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--primary); border: 3px solid var(--text)">
                <BookOpen class="w-6 h-6" style="color: var(--text)" stroke-width="2.5" />
              </div>
              <span class="text-xl font-bold" style="color: var(--text)">LearnHub</span>
            </a>
            <p class="text-sm mb-6 max-w-xs" style="color: var(--text-muted)">Empowering millions of learners worldwide with quality education accessible to everyone.</p>
            <div class="flex gap-3">
              <a v-for="icon in ['twitter','facebook','instagram','youtube']" :key="icon" href="#" class="w-10 h-10 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:opacity-70 transition-colors" style="border: 3px solid var(--text)">
                <span class="text-xs font-bold" style="color: var(--text)">{{ icon === 'twitter' ? '𝕏' : icon === 'facebook' ? 'f' : icon === 'instagram' ? '📷' : '▶' }}</span>
              </a>
            </div>
          </div>

          <!-- Link Columns -->
          <div>
            <h4 class="font-bold mb-4" style="color: var(--text)">Courses</h4>
            <ul class="space-y-2">
              <li v-for="l in ['Web Development','Design','Data Science','Mobile Apps','Marketing']" :key="l">
                <a href="#" class="text-sm hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">{{ l }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4" style="color: var(--text)">Company</h4>
            <ul class="space-y-2">
              <li v-for="l in ['About Us','Careers','Blog','Press','Partners']" :key="l">
                <a href="#" class="text-sm hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">{{ l }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4" style="color: var(--text)">Support</h4>
            <ul class="space-y-2">
              <li v-for="l in ['Help Center','Contact','Community','FAQ']" :key="l">
                <a href="#" class="text-sm hover:opacity-70 transition-colors cursor-pointer" style="color: var(--text-muted)">{{ l }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style="border-top: 3px solid var(--border)">
          <p class="text-sm" style="color: var(--text-muted)">© 2024 LearnHub. All rights reserved.</p>
          <div class="flex items-center gap-6 text-sm" style="color: var(--text-muted)">
            <a href="#" class="hover:opacity-70 transition-colors cursor-pointer">Privacy</a>
            <a href="#" class="hover:opacity-70 transition-colors cursor-pointer">Terms</a>
            <a href="#" class="hover:opacity-70 transition-colors cursor-pointer">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
