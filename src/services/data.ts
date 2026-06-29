import { Injectable } from '@angular/core';
import { data } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class DATA {

  public DATA: data = {
    language: 0,
    mobile: 0,
    screenWidth: ['1440px', '800px'],
    languages: { set: true, values: ['EN', 'DE'] },
    header: [
      { name: 'aboutMe', set: false, showOnDesktop: true, values: ['About me', 'Über mich'] },
      { name: 'skillSet', set: false, showOnDesktop: true, values: ['Skill set', 'Fähigkeiten'] },
      { name: 'myWork', set: false, showOnDesktop: true, values: ['My work', 'Projekt'] },
      { name: 'contact', set: false, showOnDesktop: false, values: ['Contact', 'Kontakt'] }
    ],
    hero: {
      photo: { x: [32, 0], y: [106, 154], width: [761, 645] },
      hello: { x: [731, 197], y: [227, 0], width: [645, 367.72], height: [61, 61], font: [64, 64], values: ['Hello! I am Adam', 'Hallo! Ich bin Adam'] },
      profession: { x: [731, 199.28], y: [305, 30], width: [645, 645], height: [61, 61], font: [128, 128], values: [['fullstack ', 'fullstack '], ['developer', 'developer']] },
      scroll: { x: [987, 731], y: [656, 0], width: [95, 645], font: [23, 23], values: ['Scroll down', 'Scroll down'] },
      scrollline: { x: [1034, 731], y: [694, 0], width: [0, 0], height: [330, 0] },
      socialButtons: {
        x: [1300, 731], y: [789, 0], width: [40, 645], height: [170, 0], values: [
          { name: 'GitHub', icon: 'github.png', link: 'https://github.com/adam-on-developerakademie' },
          { name: 'Email', icon: 'mail.png', link: 'mailto:adam.piskorek@online.de' },
          { name: 'LinkedIn', icon: 'linkedin.png', link: 'https://www.linkedin.com/in/adam-piskorek' },
        ]
      }
    },
    letsWorkTogether: {
      text: { x: [32, 32], y: [1432, 1200], width: [1376, 736], height: [153, 153], font: [64, 64], values: [['Let\'s work together', 'Lass uns beginnen'], ['I am', 'Ich bin'], ['As a passionate fullstack developer, I combine in-depth knowledge of both frontend and backend technologies with a strong enthusiasm for innovative solutions. I draw my inspiration from the opportunity to create real value with my code.', 'Als leidenschaftlicher Fullstack-Entwickler vereine ich fundierte Kenntnisse in Frontend- und Backend-Technologien mit Begeisterung für innovative Lösungen. Meine Inspiration ziehe ich aus der Möglichkeit, mit meinem Code echten Mehrwert zu schaffen.'], ['The connecting creative user interfaces with efficient, scalable logic in the background. My constant drive to learn new things motivates me to regularly explore modern frameworks, programming languages, and best practices, and to integrate them into my work. For me, lifelong learning is a part of my personal motivation.', 'Mich reitzt dei Verbindung von kreativer Benutzeroberfläche mit effizienter, skalierbarer Logik im Hintergrund. Mein stetiger Drang, Neues zu lernen, treibt mich an, regelmäßig moderne Frameworks, Programmiersprachen und Best Practices zu erforschen und in meine Arbeit zu integrieren. Für mich ist lebenslanges Lernen Teil meiner persönlichen Motivation.']] },
      icons: { icon: [['located.png', 'locatedPlus.png'], ['remote.png', 'remotePlus.png'], ['relocate.png', 'relocatePlus.png']], values: [['located in Bad Sassendorf', 'zuhause in Bad Sassendorf'], ['open to work remote', 'offen für Fernarbeit'], ['open to relocate', 'offen für Umzug']] },
      button: { email: ['adam.piskorek@online.de', 'adam.piskorek@online.de'], values: ['Send a message', 'Kontaktiere mich'] },
    },
    skillSet: {
      title: { values: ['Skill set', 'Fähigkeiten'] },
      hoverEnabled: false,
      skills: {
        groups: [
          {
            title: ['Frontend', 'Frontend'],
            values: [
              { name: 'Angular', icon: 'Angular.png', level: 75 },
              { name: 'TypeScript', icon: 'TypeScript.png', level: 80 },
              { name: 'JavaScript', icon: 'JavaScript.png', level: 85 },
              { name: 'HTML', icon: 'HTML.png', level: 90 },
              { name: 'CSS', icon: 'CSS.png', level: 80 },
              { name: 'RxJS', icon: 'RxJs.png', level: 70 },
              { name: 'Material Design', icon: 'MaterialDesign.png', level: 60 },
              { name: 'REST-API', icon: 'REST-API.png', level: 70 },
              { name: 'Git', icon: 'Git.png', level: 70 },
              { name: 'Scrum', icon: 'Scrum.png', level: 70 },
              { name: 'Growth Mindset', icon: 'GrowthMindset.png', level: 50 },
            ]
          },
          {
            title: ['Backend', 'Backend'],
            values: [
              { name: 'Python', icon: 'Python.png', level: 75 },
              { name: 'Flask', icon: 'Flask.png', level: 70 },
              { name: 'Docker', icon: 'Docker.png', level: 65 },
              { name: 'Linux', icon: 'Linux.png', level: 70 },
              { name: 'PostgreSQL', icon: 'PostgreSQL.png', level: 70 },
              { name: 'Redis', icon: 'Redis.png', level: 65 },
              { name: 'Heroku', icon: 'Heroku.png', level: 60 },
              { name: 'Cloud', icon: 'Cloud.png', level: 65 },
              { name: 'Firebase', icon: 'Firebase.png', level: 70 },
              { name: 'SQL', icon: 'SQL.png', level: 90 },
            ]
          }
        ]
      }
    },
    myWork: {
      title: ['My work', 'Projekte'],
      text: ['Explore a selection of my work here - Interact with projects to see my skills in action.', 'Entdecken Sie eine Auswahl meiner Arbeiten hier - Interagieren Sie mit Projekten, um meine Fähigkeiten in Aktion zu sehen.'],
      projects: [
        {
          title: ['Join', 'Join'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories. '],
          image: 'Work1.png',
          link: 'https://join-1344.developerakademie.net/angular-projects/join2/login',
          githubLink: 'https://github.com/adam-on-developerakademie/Join'
        },
        {
          title: ['El Pollo Loco', 'El Pollo Loco'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.'],
          image: 'Work2.png',
          link: 'https://adam-piskorek.developerakademie.net/12_El_Pollo_Loco/',
          githubLink: 'https://github.com/adam-on-developerakademie/12_El_Pollo_Loco'
        },
        {
          title: ['DA Buble', 'DA Buble'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['A very Simple Customer Relationship Management system working with CRUD functionality. '],
          image: 'Work3.png',
          link: 'https://adam-piskorek.developerakademie.net/08_Pokedex/',
          githubLink: 'https://github.com/adam-on-developerakademie/Videoflix'
        },
        {
          title: ['Pokédex', 'Pokédex'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Based on the PokéAPI a simple library that provides and catalogues pokemon information.'],
          image: 'Work4.png',
          link: 'https://adam-piskorek.developerakademie.net/08_Pokedex/',
          githubLink: 'https://github.com/adam-on-developerakademie/08_Pokedex'
        }
      ]
    },
    teamPlayer: {
      title: ['Need a Teamplayer?', 'Suchen Sie einen Teamplayer?'],
      text: ['Here what my colleagues said about me', 'Hier ist, was meine Kollegen über mich gesagt haben:'],
      opinions: [
        {
          person: ['Muhammed Yunus Amini', 'Muhammed Yunus Amini'],
          project: ['Project Join', 'Project Join'],
          opinion: ['‘‘Adam war während des gesamten Projekts ein sehr zuverlässiger und hilfsbereiter Teamkollege. Er war immer erreichbar, hat die Gruppe bis zum letzten Feinschliff unterstützt.’’', '‘‘Adam was a very reliable and helpful team member throughout the entire project. He was always available, supported the group until the last finishing touch.’’']
        },
        {
          person: ['You could be next', 'Du könntest der Nächste sein'],
          project: ['Your review here', 'Hier könnte deine Bewertung stehen'],
          opinion: ['Maybe your collaboration feedback will be the next story here.', 'Vielleicht steht hier bald dein Feedback zur Zusammenarbeit.']
        },
        {
          person: ['Next partner', 'Nächster Partner'],
          project: ['A place for your recommendation', 'Ein Platz für deine Empfehlung'],
          opinion: ['If you become my next partner, this spot is yours for a short review.', 'Wenn du mein nächster Partner wirst, gehört dieser Platz deiner kurzen Bewertung.']
        }
      ]
    },
    contact: {
      title: ['Contact', 'Kontakt'],
      ask: ['Got a problem to solve?', 'Haben Sie ein Problem zu lösen?'],
      description: ['I am always open to discussing new projects, creative ideas or opportunities to be part of your visions. Feel free to reach out!', 'Ich bin immer offen für die Diskussion neuer Projekte, kreativer Ideen oder Möglichkeiten, Teil Ihrer Visionen zu sein. Zögern Sie nicht, mich zu kontaktieren!'],
      contactMe: [['Need a Frontend developer?', 'Brauchen Sie einen Frontend-Entwickler?'], ['Contact me!', 'Kontaktieren Sie mich!']],
      form: {
        placeholders: {
          name: ['Your name', 'Dein Name'],
          email: ['Your email', 'Deine E-Mail'],
          message: ['Your message', 'Deine Nachricht']
        },
        privacy: [
          'I have read the privacy policy and agree to the processing of my data as outlined.',
          'Ich habe die Datenschutzerklärung gelesen und stimme der beschriebenen Verarbeitung meiner Daten zu.'
        ],
        success: [
          'Message sent successfully.',
          'Danke! Deine Nachricht wurde erfolgreich gesendet.'
        ],
        error: [
          'Sorry, your message could not be sent. Please try again.',
          'Leider konnte deine Nachricht nicht gesendet werden. Bitte versuche es erneut.'
        ],
        button: {
          idle: ['Say hello ;)', 'Sag hallo ;)'],
          sending: ['Sending...', 'Wird gesendet...'],
          success: ['Message sent successfully.', 'Senden erfolgreich']
        },
        validation: {
          required: ['This field is required', 'Dieses Feld ist erforderlich'],
          minlengthPrefix: ['Minimum ', 'Mindestens '],
          minlengthSuffix: [' characters', ' Zeichen'],
          email: ['Please enter a valid email', 'Bitte gib eine gültige E-Mail-Adresse ein'],
          invalid: ['Invalid input', 'Ungültige Eingabe']
        }
      },
    },
    legalNotice: {
      name: ['Adam Piskorek', 'Adam Piskorek'],
      city: ['Hamburg', 'Hamburg'],
      country: ['Germany', 'Deutschland'],
      phone: ['+49 152 53935293', '+49 152 53935293'],
      studentNamesList: ['Adam Piskorek', 'Adam Piskorek'],
      joinOperatorAddress: ['c/o IP-Management #8631, Ludwig-Erhard-Strasse 18', 'c/o IP-Management #8631, Ludwig-Erhard-Strasse 18'],
      postcodeCity: ['20459 Hamburg', '20459 Hamburg'],
      email: ['adam.piskorek@online.de', 'adam.piskorek@online.de'],
      contactEmail: ['adam.piskorek@online.de', 'adam.piskorek@online.de']
    },
    footer: {
      developer: ['© Adam Piskorek 2026', '© Adam Piskorek 2026'],
      socialButtons: {
        values: [
          { name: 'GitHub', icon: 'Github_button.png', link: 'https://github.com/adam-on-developerakademie' },
          { name: 'Email', icon: 'Email_button.png', link: 'mailto:adam.piskorek@online.de' },
          { name: 'LinkedIn', icon: 'Linkedin_button.png', link: 'https://www.linkedin.com/in/adam-piskorek' },
        ]
      }
    }
  }
}