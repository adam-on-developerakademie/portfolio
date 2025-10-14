import { Injectable } from '@angular/core';
import { data } from '../interfaces/data';
import { TeamPlayer } from '../app/teamplayer/teamplayer';

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
      { name: 'aboutMe', set: false, values: ['About me', 'Über mich'] },
      { name: 'skillSet', set: false, values: ['Skill set', 'Fähigkeiten'] },
      { name: 'myWork', set: false, values: ['My work', 'Projekt'] }
    ],
    hero: {
      photo: { x: [32, 0], y: [106, 154], width: [761, 645] },
      hello: { x: [731, 197], y: [227, 0], width: [645, 367.72], height: [61, 61], font: [64, 64], values: ['Hello! I am Adam', 'Hallo! Ich bin Adam'] },
      profession: { x: [731, 199.28], y: [305, 30], width: [645, 645], height: [61, 61], font: [128, 128], values: [['fullstack ', 'fullstack '], ['developer', 'developer']] },
      scroll: { x: [987, 731], y: [656, 0], width: [95, 645], font: [23, 23], values: ['SCROLL', 'SCROLL'] },
      scrollline: { x: [1034, 731], y: [694, 0], width: [0, 0], height: [330, 0] },
      socialButtons: {
        x: [1300, 731], y: [789, 0], width: [40, 645], height: [170, 0], values: [
          { name: 'GitHub', icon: 'github.png', link: 'https://github.com/adam-on-developerakademie' },
          { name: 'Email', icon: 'mail.png', link: 'mailto:adam.piskorek@gmx.com' },
          { name: 'LinkedIn', icon: 'linkedin.png', link: 'https://www.linkedin.com/in//' },
        ]
      }
    },
    letsWorkTogether: {
      text: { x: [32, 32], y: [1432, 1200], width: [1376, 736], height: [153, 153], font: [64, 64], values: [['Let\'s work together', 'Lass uns beginnen'], ['I am', 'Ich bin'], ['As a passionate fullstack developer, I combine in-depth knowledge of both frontend and backend technologies with a strong enthusiasm for innovative solutions. I draw my inspiration from the opportunity to create real value with my code.', 'Als leidenschaftlicher Fullstack-Entwickler vereine ich fundierte Kenntnisse in Frontend- und Backend-Technologien mit Begeisterung für innovative Lösungen. Meine Inspiration ziehe ich aus der Möglichkeit, mit meinem Code echten Mehrwert zu schaffen.'], ['The connecting creative user interfaces with efficient, scalable logic in the background. My constant drive to learn new things motivates me to regularly explore modern frameworks, programming languages, and best practices, and to integrate them into my work. For me, lifelong learning is a part of my personal motivation.', 'Mich reitzt dei Verbindung von kreativer Benutzeroberfläche mit effizienter, skalierbarer Logik im Hintergrund. Mein stetiger Drang, Neues zu lernen, treibt mich an, regelmäßig moderne Frameworks, Programmiersprachen und Best Practices zu erforschen und in meine Arbeit zu integrieren. Für mich ist lebenslanges Lernen Teil meiner persönlichen Motivation.']] },
      icons: { icon: [['located.png', 'locatedPlus.png'], ['remote.png', 'remotePlus.png'], ['relocate.png', 'relocatePlus.png']], values: [['located in Bad Sassendorf', 'zuhause in Bad Sassendorf'], ['open to work remote', 'offen für Fernarbeit'], ['open to relocate', 'offen für Umzug']] },
      button: { email: ['adam.piskorek@gmx.com', 'adam.piskorek@gmx.com'], values: ['Send a message', 'Kontaktiere mich'] },
    },
    skillSet: {
      title: { values: ['Skill set', 'Fähigkeiten'] },
      skills: {
        values: [
          { name: 'Angular', icon: 'Angular.png', level: 75 },
          { name: 'TypeScript', icon: 'TypeScript.png', level: 80 },
          { name: 'JavaScript', icon: 'JavaScript.png', level: 85 },
          { name: 'HTML', icon: 'HTML.png', level: 90 },
          { name: 'SQL', icon: 'SQL.png', level: 90 },
          { name: 'Firebase', icon: 'Firebase.png', level: 70 },
          { name: 'Scrum', icon: 'Scrum.png', level: 70 },
          { name: 'Git', icon: 'Git.png', level: 70 },
          { name: 'CSS', icon: 'CSS.png', level: 80 },
          { name: 'REST-API', icon: 'REST-API.png', level: 70 },
          { name: 'Material Design', icon: 'MaterialDesign.png', level: 60 },
          { name: 'Growth Mindset', icon: 'GrowthMindset.png', level: 50 },
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
          description: ['Description of Project 1', 'Beschreibung von Projekt 1'],
          image: 'Work1.png',
          link: 'https://project1.example.com'
        },
        {
          title: ['El Pollo Loco', 'El Pollo Loco'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Description of Project 2', 'Beschreibung von Projekt 2'],
          image: 'Work2.png',
          link: 'https://project2.example.com'
        },
        {
          title: ['DA Buble', 'DA Buble'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Description of Project 3', 'Beschreibung von Projekt 3'],
          image: 'Work3.png',
          link: 'https://project3.example.com'
        },
        {
          title: ['Pokédex', 'Pokédex'],
          used: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
          description: ['Description of Project 4', 'Beschreibung von Projekt 4'],
          image: 'Work4.png',
          link: 'https://project4.example.com'
        }
      ]
    },
    teamPlayer: {
      title: ['Need a Teamplayer?', 'Suchen Sie einen Teamplayer?'],
      text: ['Here what my colleagues said about me', 'Hier ist, was meine Kollegen über mich gesagt haben:'],
      opinions: [
        {
          person: 'James Rugman',
          project: 'Project Join',
          opinion: ['‘‘Sofia is a reliable and friendly person. Work in a structured way and write a clear code. I  highly recommend her as a colleague.’’', 'Always willing to help out.']
        },
        {
          person: 'Evelyn Marx',
          project: 'Project DA Bubble',
          opinion: ['‘’ Sofia is a trustworthy teamplayer and can cope with the stress of deadlines. Structured work and clear code.‘’', 'Brings a positive attitude to the team.']
        },
        {
          person: 'Noah Müller',
          project: 'Project El Pollo Loco',
          opinion: ['‘’Sofia  had to develop, format and deliver content in collaboration with the team members. She is a reliable and friendly person.’’', 'A pleasure to work with.']
        }
      ]
    },
    contact: {
      title: ['Contact', 'Kontakt'],
      ask: ['Got a problem to solve?', 'Haben Sie ein Problem zu lösen?'],
      description: ['I am always open to discussing new projects, creative ideas or opportunities to be part of your visions. Feel free to reach out!', 'Ich bin immer offen für die Diskussion neuer Projekte, kreativer Ideen oder Möglichkeiten, Teil Ihrer Visionen zu sein. Zögern Sie nicht, mich zu kontaktieren!'],
      contactMe: [['Need a Frontend developer?', 'Brauchen Sie einen Frontend-Entwickler?'], ['Contact me!', 'Kontaktieren Sie mich!']],
    },
    footer: { text: ['© 2024 Adam Piskorek', '© 2024 Adam Piskorek'] }
  };
}