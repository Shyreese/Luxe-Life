        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

        document.addEventListener('DOMContentLoaded', function() {
            
            // Your web app's Firebase configuration
            const firebaseConfig = {
              apiKey: "AIzaSyD9z9rp07fK2nQt5bT32GWLhyqf2pjXxGg",
              authDomain: "luxe-life-properties.firebaseapp.com",
              projectId: "luxe-life-properties",
              storageBucket: "luxe-life-properties.appspot.com",
              messagingSenderId: "891605931606",
              appId: "1:891605931606:web:9913ddba4e447f16f20df7"
            };

            // --- ACTION REQUIRED: Paste your Google AI API Key here ---
            const GEMINI_API_KEY = "YOUR_GOOGLE_AI_API_KEY";

            // --- Firebase Initialization ---
            try {
                if (!firebaseConfig || !firebaseConfig.apiKey) {
                    throw new Error("Firebase config is missing or incomplete. Please add it to the script.");
                }
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);
                initializeAppScripts(auth, db);
            } catch (error) {
                console.error("Initialization Failed:", error);
                const residentPortal = document.getElementById('residents');
                if (residentPortal) {
                    residentPortal.innerHTML = `
                        <div class="container mx-auto px-6 text-center">
                            <h2 class="font-lora text-3xl md:text-4xl font-bold">Portal Temporarily Unavailable</h2>
                            <p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">A configuration error occurred. Please contact support.</p>
                        </div>
                    `;
                }
                const conciergeButton = document.getElementById('concierge-button');
                if(conciergeButton) conciergeButton.disabled = true;
            }

            function initializeAppScripts(auth, db) {
                // --- Mobile Menu ---
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                const mobileMenu = document.getElementById('mobile-menu');
                mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
                document.querySelectorAll('.mobile-nav-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href');
                        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                        mobileMenu.classList.add('hidden');
                    });
                });

                // --- Active Nav Link Scrolling ---
                const navLinks = document.querySelectorAll('.nav-link');
                const sections = document.querySelectorAll('main > section, footer');
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            navLinks.forEach(link => {
                                const href = link.getAttribute('href');
                                if (href && href.substring(1) === entry.target.id) {
                                    link.classList.add('nav-link-active');
                                } else {
                                    link.classList.remove('nav-link-active');
                                }
                            });
                        }
                    });
                }, { threshold: 0.5 });
                sections.forEach(section => { if(section.id) observer.observe(section); });

                // --- Fade-in Animations ---
                const faders = document.querySelectorAll('.fade-in-up');
                const faderObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) entry.target.classList.add('is-visible');
                    });
                }, { threshold: 0.1 });
                faders.forEach(fader => faderObserver.observe(fader));
                
                // --- Property Gallery ---
                const images = [
                    'https://i.imgur.com/VgWemC1.jpeg', 'https://i.imgur.com/L7rpcwK.jpeg',
                    'https://i.imgur.com/ScHN21W.jpeg', 'https://i.imgur.com/Cq6nPzF.jpeg',
                    'https://i.imgur.com/JDSjv2K.jpeg', 'https://i.imgur.com/x9TRwGB.jpeg',
                    'https://i.imgur.com/wzCq4Nd.jpeg', 'https://i.imgur.com/fKgiUlR.jpeg',
                    'https://i.imgur.com/ZCtQ8Qo.jpeg', 'https://i.imgur.com/1pXPZnq.jpeg', 'https://i.imgur.com/el27KUB.jpeg'
                ];
                let currentImageIndex = 0;
                const mainImage = document.getElementById('gallery-main-image');
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                const thumbnailContainer = document.getElementById('thumbnail-container');
                const detailsToggleBtn = document.getElementById('details-toggle-btn');
                const propertyDetails = document.getElementById('property-details');
                
                function updateGallery() {
                    if (!mainImage) return;
                    mainImage.style.opacity = 0;
                    setTimeout(() => {
                        mainImage.src = images[currentImageIndex];
                        mainImage.style.opacity = 1;
                    }, 250);
                    
                    thumbnailContainer.innerHTML = '';
                    images.forEach((src, index) => {
                        const thumb = document.createElement('img');
                        thumb.src = src; 
                        thumb.alt = `Amara Retreat Photo ${index + 1}`;
                        thumb.className = 'w-full h-auto object-cover aspect-square rounded-md cursor-pointer border-4 border-transparent transition-all hover:opacity-80';
                        if(index === currentImageIndex) thumb.classList.add('border-gold');
                        thumb.addEventListener('click', () => { currentImageIndex = index; updateGallery(); });
                        thumbnailContainer.appendChild(thumb);
                    });
                }
                if(prevBtn) prevBtn.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; updateGallery(); });
                if(nextBtn) nextBtn.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % images.length; updateGallery(); });
                if(detailsToggleBtn) {
                  updateGallery();
                  detailsToggleBtn.addEventListener('click', () => {
                      const isVisible = !propertyDetails.classList.contains('hidden');
                      if(isVisible) {
                          propertyDetails.classList.add('hidden');
                          detailsToggleBtn.textContent = "View Details & Gallery";
                      } else {
                          propertyDetails.classList.remove('hidden');
                          detailsToggleBtn.textContent = "Hide Details";
                          setTimeout(() => propertyDetails.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }
                  });
                }
                
                // --- Generic Modal Logic ---
                const closeTriggers = document.querySelectorAll('[data-close-button]');

                function openModal(modal) {
                    if (modal == null) return;
                    modal.classList.remove('hidden');
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                        modal.querySelector('.modal-content').classList.remove('opacity-0', '-translate-y-10');
                    }, 10);
                }

                function closeModal(modal) {
                    if (modal == null) return;
                    modal.classList.add('opacity-0');
                    modal.querySelector('.modal-content').classList.add('opacity-0', '-translate-y-10');
                    setTimeout(() => modal.classList.add('hidden'), 300);
                }

                document.querySelectorAll('.modal-overlay').forEach(overlay => {
                    overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) closeModal(overlay);
                    });
                });

                closeTriggers.forEach(button => {
                    button.addEventListener('click', () => {
                        const modal = button.closest('.modal-overlay');
                        closeModal(modal);
                    });
                });

                document.getElementById('privacy-policy-link')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(document.getElementById('privacy-modal'));
                });
                document.getElementById('accessibility-statement-link')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(document.getElementById('accessibility-modal'));
                });
                document.getElementById('donotsell-link')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(document.getElementById('donotsell-modal'));
                });
                
                // --- Firebase Auth UI Management ---
                const authModal = document.getElementById('auth-modal');
                const loginModalBtn = document.getElementById('login-modal-btn');
                const loginFormContainer = document.getElementById('login-form-container');
                const signupFormContainer = document.getElementById('signup-form-container');
                const showSignupBtn = document.getElementById('show-signup-btn');
                const showLoginBtn = document.getElementById('show-login-btn');
                const modalTitle = document.getElementById('modal-title');
                const loggedOutView = document.getElementById('resident-portal-logged-out');
                const loggedInView = document.getElementById('resident-portal-logged-in');
                const residentNameSpan = document.getElementById('resident-name');
                const logoutBtn = document.getElementById('logout-btn');
                const authErrorDiv = document.getElementById('auth-error');

                loginModalBtn?.addEventListener('click', () => openModal(authModal));

                showSignupBtn?.addEventListener('click', () => {
                    loginFormContainer.classList.add('hidden');
                    signupFormContainer.classList.remove('hidden');
                    modalTitle.textContent = "Create Resident Account";
                    authErrorDiv.classList.add('hidden');
                });
                showLoginBtn?.addEventListener('click', () => {
                    signupFormContainer.classList.add('hidden');
                    loginFormContainer.classList.remove('hidden');
                    modalTitle.textContent = "Resident Login";
                    authErrorDiv.classList.add('hidden');
                });
                
                // Signup, Login, and Password Strength
                const signupForm = document.getElementById('signup-form');
                const loginForm = document.getElementById('login-form');
                const signupPasswordInput = document.getElementById('signup-password');
                const strengthProgressBar = document.getElementById('password-strength-progress');
                const strengthText = document.getElementById('password-strength-text');

                signupPasswordInput?.addEventListener('input', () => {
                    const password = signupPasswordInput.value;
                    if(password.length === 0) {
                        strengthProgressBar.style.width = '0%';
                        strengthText.textContent = '';
                        return;
                    }
                    let score = 0;
                    if (password.length >= 8) score++;
                    if (password.length >= 12) score++;
                    if (/[A-Z]/.test(password)) score++;
                    if (/[0-9]/.test(password)) score++;
                    if (/[^A-Za-z0-9]/.test(password)) score++;
                    
                    const strengthLevels = {
                        0: { width: '20%', color: 'bg-red-500', text: 'Very Weak' }, 1: { width: '20%', color: 'bg-red-500', text: 'Weak' },
                        2: { width: '40%', color: 'bg-yellow-500', text: 'Fair' }, 3: { width: '60%', color: 'bg-yellow-500', text: 'Good' },
                        4: { width: '80%', color: 'bg-green-500', text: 'Strong' }, 5: { width: '100%', color: 'bg-green-500', text: 'Very Strong' },
                    };
                    const { width, color, text } = strengthLevels[score];
                    strengthProgressBar.style.width = width;
                    strengthProgressBar.className = `h-2 rounded-full transition-all ${color}`;
                    strengthText.textContent = text;
                });
                
                signupForm?.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = e.submitter;
                    btn.disabled = true; btn.innerHTML = `<span class="spinner w-5 h-5 mx-auto border-2 rounded-full"></span>`;
                    authErrorDiv.classList.add('hidden');
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, signupForm.email.value, signupForm.password.value);
                        await updateProfile(userCredential.user, { displayName: signupForm.name.value });
                        signupForm.reset();
                        closeModal(authModal);
                    } catch (error) {
                        authErrorDiv.textContent = error.message;
                        authErrorDiv.classList.remove('hidden');
                    } finally {
                        btn.disabled = false; btn.textContent = 'Sign Up';
                    }
                });

                loginForm?.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = e.submitter;
                    btn.disabled = true; btn.innerHTML = `<span class="spinner w-5 h-5 mx-auto border-2 rounded-full"></span>`;
                    authErrorDiv.classList.add('hidden');
                    try {
                        await signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value);
                        loginForm.reset();
                        closeModal(authModal);
                    } catch (error) {
                        authErrorDiv.textContent = 'Invalid email or password.';
                        authErrorDiv.classList.remove('hidden');
                    } finally {
                        btn.disabled = false; btn.textContent = 'Login';
                    }
                });

                logoutBtn?.addEventListener('click', () => signOut(auth));

                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        loggedOutView.classList.add('hidden');
                        loggedInView.classList.remove('hidden');
                        residentNameSpan.textContent = user.displayName || 'Resident';
                    } else {
                        loggedInView.classList.add('hidden');
                        loggedOutView.classList.remove('hidden');
                        residentNameSpan.textContent = '';
                    }
                });

                // --- Contact Form & Duration Calculation ---
                const contactForm = document.getElementById('contact-form');
                const moveInDateInput = document.getElementById('move-in-date');
                const moveOutDateInput = document.getElementById('move-out-date');
                const stayDurationSpan = document.getElementById('stay-duration');

                function calculateStayDuration() {
                    if (!moveInDateInput || !moveOutDateInput || !stayDurationSpan) return;
                    const startDate = moveInDateInput.value;
                    const endDate = moveOutDateInput.value;

                    if (startDate && endDate) {
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        if (end > start) {
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            stayDurationSpan.textContent = `${diffDays} days`;
                        } else {
                            stayDurationSpan.textContent = 'Invalid dates';
                        }
                    } else {
                        stayDurationSpan.textContent = '-- days';
                    }
                }

                moveInDateInput?.addEventListener('change', calculateStayDuration);
                moveOutDateInput?.addEventListener('change', calculateStayDuration);

                contactForm?.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = e.submitter;
                    btn.disabled = true; btn.innerHTML = `<span class="spinner w-5 h-5 mx-auto border-2 rounded-full"></span>`;
                    try {
                        await addDoc(collection(db, "contactInquiries"), {
                            name: contactForm.name.value, email: contactForm.email.value,
                            moveInDate: moveInDateInput.value,
                            moveOutDate: moveOutDateInput.value,
                            lengthOfStayNotes: contactForm.stay.value,
                            message: contactForm.message.value, createdAt: serverTimestamp()
                        });
                        contactForm.reset();
                        calculateStayDuration();
                        document.getElementById('contact-success').classList.remove('hidden');
                        setTimeout(() => document.getElementById('contact-success').classList.add('hidden'), 5000);
                    } catch (error) {
                        console.error("Error writing document: ", error);
                        alert("There was an error submitting your form.");
                    } finally {
                        btn.disabled = false; btn.textContent = 'Send Inquiry';
                    }
                });
                
                // --- Testimonial Carousel ---
                const carousel = document.getElementById('testimonial-carousel');
                if (carousel) {
                    const prevTestimonialBtn = document.getElementById('prev-testimonial');
                    const nextTestimonialBtn = document.getElementById('next-testimonial');
                    let autoScrollInterval;

                    const getScrollAmount = () => {
                        const firstCard = carousel.querySelector('.testimonial-card');
                        if (!firstCard) return carousel.clientWidth / 3;
                        const gap = parseInt(window.getComputedStyle(carousel).gap);
                        return firstCard.offsetWidth + gap;
                    };
                    const stopAutoScroll = () => clearInterval(autoScrollInterval);
                    const startAutoScroll = () => {
                        stopAutoScroll();
                        autoScrollInterval = setInterval(() => {
                            const scrollAmount = getScrollAmount();
                            if (carousel.scrollLeft + carousel.clientWidth + scrollAmount >= carousel.scrollWidth) {
                                carousel.scrollTo({ left: 0, behavior: 'smooth' });
                            } else {
                                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                            }
                        }, 7000);
                    };
                    const scrollAction = (direction) => {
                        stopAutoScroll();
                        const amount = getScrollAmount() * direction;
                        carousel.scrollBy({ left: amount, behavior: 'smooth' });
                        startAutoScroll();
                    };
                    
                    prevTestimonialBtn.addEventListener('click', () => scrollAction(-1));
                    nextTestimonialBtn.addEventListener('click', () => scrollAction(1));
                    carousel.addEventListener('mouseenter', stopAutoScroll);
                    carousel.addEventListener('mouseleave', startAutoScroll);
                    startAutoScroll();
                }

                // --- AI Concierge ---
                const conciergeBtn = document.getElementById('concierge-button');
                const conciergeSelect = document.getElementById('concierge-select');
                const conciergeLoading = document.getElementById('concierge-loading');
                const conciergeOutput = document.getElementById('concierge-output');

                conciergeBtn?.addEventListener('click', async () => {
                    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GOOGLE_AI_API_KEY") {
                        conciergeOutput.textContent = "AI Concierge is not configured. An API key is required.";
                        conciergeOutput.classList.remove('hidden');
                        return;
                    }
                    const selectedValue = conciergeSelect.value;
                    const prompt = `Please provide a short, numbered list of 3 ${selectedValue} near the North Natomas area of Sacramento, CA. Only return the numbered list.`;
                    
                    conciergeBtn.disabled = true;
                    conciergeLoading.classList.remove('hidden');
                    conciergeOutput.classList.add('hidden');
                    
                    try {
                        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        const text = response.text().replace(/\*/g, ''); // Clean up markdown
                        conciergeOutput.innerHTML = text.replace(/\n/g, '<br>');
                        conciergeOutput.classList.remove('hidden');
                    } catch(error) {
                        console.error("AI Concierge Error:", error);
                        conciergeOutput.textContent = "Sorry, we couldn't fetch recommendations at this time.";
                        conciergeOutput.classList.remove('hidden');
                    } finally {
                        conciergeBtn.disabled = false;
                        conciergeLoading.classList.add('hidden');
                    }
                });
            }
        });
