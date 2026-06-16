import defaultClosed from '../assets/skins/default-closed.png';
import defaultOpen from '../assets/skins/default-open.png';
import pixelClosed from '../assets/skins/pixel-closed.png';
import pixelOpen from '../assets/skins/pixel-open.png';
import sadClosed from '../assets/skins/sad-closed.png';
import sadOpen from '../assets/skins/sad-open.png';
import angryClosed from '../assets/skins/angry-closed.png';
import angryOpen from '../assets/skins/angry-open.png';
import animeClosed from '../assets/skins/anime-closed.png';
import animeOpen from '../assets/skins/anime-open.png';
import girlClosed from '../assets/skins/girl-closed.png';
import girlOpen from '../assets/skins/girl-open.png';
import konataClosed from '../assets/skins/konata-closed.png';
import konataOpen from '../assets/skins/konata-open.png';
import galaxyClosed from '../assets/skins/galaxy-closed.png';
import galaxyOpen from '../assets/skins/galaxy-open.png';
import goldClosed from '../assets/skins/gold-closed.png';
import goldOpen from '../assets/skins/gold-open.png';

const SKIN_CATALOG = [
  {
    id: 'default',
    name: 'Default',
    price: 0,
    closedImage: defaultClosed,
    openImage: defaultOpen,
  },
  {
    id: 'pixel',
    name: 'Pixel',
    price: 50,
    closedImage: pixelClosed,
    openImage: pixelOpen,
  },
  {
    id: 'sad',
    name: 'Sad',
    price: 120,
    closedImage: sadClosed,
    openImage: sadOpen,
  },
  {
    id: 'angry',
    name: 'Angry',
    price: 180,
    closedImage: angryClosed,
    openImage: angryOpen,
  },
  {
    id: 'anime',
    name: 'Anime',
    price: 260,
    closedImage: animeClosed,
    openImage: animeOpen,
  },
  {
    id: 'girl',
    name: 'Girl',
    price: 420,
    closedImage: girlClosed,
    openImage: girlOpen,
  },
  {
    id: 'konata',
    name: 'Konata',
    price: 650,
    closedImage: konataClosed,
    openImage: konataOpen,
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    price: 900,
    closedImage: galaxyClosed,
    openImage: galaxyOpen,
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1200,
    closedImage: goldClosed,
    openImage: goldOpen,
  },
];

export default SKIN_CATALOG;
