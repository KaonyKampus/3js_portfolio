export const hudData = {
    about: {
        title: 'ABOUT ME',
        modalClass: 'modal-about',
        tabs: [
            {
                id: 'profile',
                label: 'Profile',
                type: 'standard',
                content: `
                    <div class="hud-card">
                        <div class="about-profile-grid">
                            <div class="profile-avatar-container" onclick="openLightbox('./assets/david.png', 'David Silva - Profile Photo')" style="cursor: pointer;" title="Click to expand">
                                <img src="./assets/david.png" alt="David Silva" class="profile-avatar-img">
                                <div class="image-hover-overlay" style="border-radius: 50%;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </div>
                            </div>
                            <div class="about-profile-info">
                                <h4>Software Engineer & Quality Business Analyst</h4>
                                <p>Software Engineering student at Fundación Universitaria Compensar and Quality Business Analyst / Champion at TCS. Specializing in software architecture, quality assurance (QA), manual functional testing, and full-stack web development.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'skills',
                label: 'Skills',
                type: 'standard',
                content: `
                    <div class="hud-card">
                        <h4>Languages & Tools</h4>
                        <p>Java, JavaScript, TypeScript, Angular, Three.js, HTML5/CSS3, Servlets/JSP, MySQL, MariaDB, Git, Jira, IntelliJ, VS Code, and NetBeans.</p>
                    </div>
                `
            }
        ]
    },
    projects: {
        title: 'FEATURED PROJECTS',
        modalClass: 'modal-projects',
        tabs: [
            {
                id: 'web',
                label: 'Web & 3D',
                type: 'carousel',
                projects: [
                    {
                        title: 'Periodic Table',
                        description: 'Resorce to learn periodic table elements',
                        image: './assets/periodic_table.png',
                        tags: ['HTML', 'CSS'],
                        demoUrl: 'https://kaonykampus.github.io/periodic_table/',
                        githubUrl: 'https://github.com/KaonyKampus/periodic_table'
                    },
                    {
                        title: 'Web blog ',
                        description: 'Sofware lifecycle',
                        image: './assets/development_blog.png',
                        tags: ['Angular', 'Three.js', 'TypeScript', 'SCSS'],
                        demoUrl: 'https://kaonykampus.github.io/Blog-desarrollo-software/',
                        githubUrl: 'https://github.com/KaonyKampus/Blog-desarrollo-software'
                    },
                                        {
                        title: 'Poem Collection',
                        description: 'Personal Writings',
                        image: './assets/poems.png',
                        tags: ['Angular', 'Three.js', 'TypeScript', 'CSS'],
                        demoUrl: 'https://front-kappa-peach.vercel.app/',
                        githubUrl: 'https://github.com/KaonyKampus/final_frontEnd_project'
                    }
                ]
            },
            {
                id: 'java',
                label: 'Java Backend',
                type: 'carousel',
                projects: [
                    {
                        title: 'Applicant Management System',
                        description: 'Web application built with MVC architecture, Java Servlets, JSP views, JPA layer, and MySQL.',
                        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
                        tags: ['Java Servlets', 'JSP', 'JPA', 'MySQL'],
                        demoUrl: '#',
                        githubUrl: 'https://github.com'
                    }
                ]
            }
        ]
    },
    experience: {
        title: 'BACKGROUND & EDUCATION',
        modalClass: 'modal-experience',
        items: [
            {
                category: 'work',
                role: 'Seller, Invoice Clerk & Writer',
                institution: 'TuBici Bike Shop',
                period: '2020',
                desc: 'Managed online sales, e-billing, and wrote web blog articles to enhance brand visibility and sales strategies.'
            },
            {
                category: 'work',
                role: 'Customer Service Representative',
                institution: 'Teleperformance',
                period: '2021 - 2022',
                desc: 'Provided multichannel support (calls, email, chat), handling order tracking, fraudulent transaction verification, and marketplace coordination.'
            },
            {
                category: 'edu',
                role: 'Modern Languages Degree',
                institution: 'Universidad ECCI',
                period: '2017 - 2022',
                desc: 'Higher education degree focused on multi-language acquisition, advanced communication, and linguistic foundations.'
            },
            {
                category: 'work',
                role: 'Tech Support & Sales Rep',
                institution: 'Asurion',
                period: '2022 - 2024',
                desc: 'Delivered technical assistance for mobile devices, computers, and TVs, rapidly troubleshooting software and hardware issues.'
            },
            {
                category: 'work',
                role: 'Tech Advisor',
                institution: 'Teleperformance',
                period: '2024 - 2025',
                desc: 'Integrated Meta Pixel, Conversions API, CRM, and Catalogues across platforms like WordPress, Shopify, and PrestaShop.'
            },
            {
                category: 'work',
                role: 'QA Analyst / Tester',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Jul 2025 - Oct 2025',
                desc: 'Executed manual functional testing, documented test cases, tracked defects in Jira, and collaborated within Agile Scrum sprints.'
            },
            {
                category: 'work',
                role: 'Quality Business Analyst / Champion',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Oct 2025 - Present',
                desc: 'Managed end-to-end QA processes, coordinated testing resources, aligned business requirements with technical delivery, and led daily Agile status meetings.'
            },
            {
                category: 'edu',
                role: 'Software Engineering',
                institution: 'Fundación Universitaria Compensar',
                period: '2024 - Present',
                desc: 'Undergraduate degree focusing on software development, object-oriented programming, data structures, and web architecture.'
            }
        ]
    }
};