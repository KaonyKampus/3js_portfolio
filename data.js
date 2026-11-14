export const hudData = {
    about: {
        title: 'ABOUT ME',
        modalClass: 'modal-about',
        tabs: [
            {
                id: 'profile',
                label: 'Profile',
                type: 'orbit',
                photo: './assets/David.png',
                name: 'David Silva',
                role: 'Software Engineer & Quality Business Analyst',
                bio: 'Software Engineering student at Fundación Universitaria Compensar and Quality Business Analyst / Champion at TCS. Specializing in software architecture, quality assurance (QA), manual functional testing, and full-stack web development.',
                // Each group is one orbit ring. Add or remove skills freely.
                groups: [
                    { label: 'Languages', color: '#e8ad74', skills: ['Java', 'JavaScript', 'TypeScript', 'HTML5/CSS3'] },
                    { label: 'Frameworks & Data', color: '#cfe0ff', skills: ['Angular', 'Three.js', 'Servlets/JSP', 'MySQL', 'MariaDB'] },
                    { label: 'Tools', color: '#c27a3e', skills: ['Git', 'IntelliJ', 'VS Code', 'NetBeans'] },
                    { label: 'Quality', color: '#9fd8b0', skills: ['Jira', 'Manual QA', 'Agile · Scrum'] }
                ]
            }
        ]
    },
    projects: {
        title: 'PROJECTS',
        modalClass: 'modal-projects',
        tabs: [
            {
                id: 'web',
                label: 'Web & 3D',
                type: 'ring',
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
                        tags: ['HTML', 'CSS'],
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
                label: 'Back-End',
                type: 'ring',
                projects: [
                    {
                        title: 'Finance Tutor APP',
                        description: 'Web application built with MVC architecture, Java Servlets, JSP views, JPA layer, and MySQL.',
                        image: './assets/financeTutorAPP.jpeg',
                        tags: ['Java Servlets', 'JSP', 'JPA', 'MySQL'],
                        demoUrl: 'https://github.com/KaonyKampus/Finance_Tutor_APP',
                        githubUrl: 'https://github.com/KaonyKampus/Finance_Tutor_APP'
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
                role: 'Customer Service Representative',
                institution: 'Teleperformance',
                period: '2021 - 2022',
                desc: 'Provided multichannel support (calls, email, chat), handling order tracking, fraudulent transaction verification, and marketplace coordination.',
                did: ["Answered customers by phone, email and chat.", "Tracked packages, handled orders and verified fraudulent transactions.", "Coordinated with marketplaces to confirm user orders."],
                learned: ["Solving problems accurately under time pressure.", "Working across several support channels at once."],
                skills: ["Multichannel support", "Fraud verification", "Order management"]
            },
            {
                category: 'edu',
                role: 'Modern Languages Degree',
                institution: 'Universidad ECCI',
                period: '2017 - 2022',
                desc: 'Higher education degree focused on multi-language acquisition, advanced communication, and linguistic foundations.',
                did: ["Studied language acquisition and advanced communication."],
                learned: ["How to communicate clearly across languages and cultures."],
                skills: ["English C1", "French (basic)", "German (basic)"]
            },
            {
                category: 'work',
                role: 'Tech Support & Sales Rep',
                institution: 'Asurion',
                period: '2022 - 2024',
                desc: 'Delivered technical assistance for mobile devices, computers, and TVs, rapidly troubleshooting software and hardware issues.',
                did: ["Supported customers with phones, tablets, computers and TVs.", "Quickly diagnosed and fixed software and hardware faults."],
                learned: ["Troubleshooting step by step instead of guessing.", "Explaining technical problems in simple words."],
                skills: ["Troubleshooting", "Hardware & software support", "Customer focus"]
            },
            {
                category: 'work',
                role: 'Tech Advisor',
                institution: 'Teleperformance',
                period: '2024 - 2025',
                desc: 'Integrated Meta Pixel, Conversions API, CRM, and Catalogues across platforms like WordPress, Shopify, and PrestaShop.',
                did: ["Set up Meta Pixel, Conversions API, catalogues and CRM integrations.", "Worked on WordPress, Shopify and PrestaShop stores."],
                learned: ["How web platforms exchange data through APIs.", "How tracking and marketing data flow between systems."],
                skills: ["APIs & integrations", "WordPress", "Shopify", "PrestaShop"]
            },
            {
                category: 'work',
                role: 'QA Analyst / Tester',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Jul 2025 - Oct 2025',
                desc: 'Executed manual functional testing, documented test cases, tracked defects in Jira, and collaborated within Agile Scrum sprints.',
                did: ["Ran manual functional tests and wrote test cases.", "Reported and tracked defects in Jira.", "Joined stand-ups and sprint planning in a Scrum team."],
                learned: ["How an agile team delivers software sprint by sprint.", "Writing bug reports that developers can act on."],
                skills: ["Manual testing", "Jira", "Scrum", "Test documentation"]
            },
            {
                category: 'work',
                role: 'Quality Business Analyst',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Oct 2025 - Present',
                desc: 'Managed end-to-end QA processes, coordinated testing resources, aligned business requirements with technical delivery, and led daily Agile status meetings.',
                did: ["Led QA from requirements to delivery.", "Coordinated testing resources and prioritized defects.", "Ran daily testing and client status meetings."],
                learned: ["Aligning business requirements with technical delivery.", "Reporting quality status clearly to clients."],
                skills: ["Requirements analysis", "Defect prioritization", "Leadership", "Jira"]
            },
            {
                category: 'edu',
                role: 'Software Engineering',
                institution: 'Fundación Universitaria Compensar',
                period: '2024 - Present',
                desc: 'Undergraduate degree focusing on software development, object-oriented programming, data structures, and web architecture.',
                did: ["Study software development, object-oriented programming, data structures and web architecture.", "Built this interactive 3D portfolio with Three.js."],
                learned: ["How to structure code and build web projects from scratch."],
                skills: ["JavaScript", "Node.js", "HTML / CSS", "Java", "Three.js"]
            }
        ]
    },
    contact: {
        title: 'CONTACT',
        modalClass: 'modal-contact',
        kicker: 'GET IN TOUCH',
        headline: 'Leave me a letter',
        text: 'Have a project, a job opportunity or just want to say hi? Write me a few lines and they will land straight in my inbox.',
        links: [
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/david-stiven-silva-velandia-ba3529236/', icon: 'fa-brands fa-linkedin-in' },
            { label: 'GitHub', url: 'https://github.com/KaonyKampus', icon: 'fa-brands fa-github' },
            { label: 'WhatsApp', url: 'https://wa.me/573213101615', icon: 'fa-brands fa-whatsapp' }
        ]
    }
};