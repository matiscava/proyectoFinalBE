import MemoryContainer from "../../containers/MemoryContainer.js";

class ProductDaoMemory extends MemoryContainer {
 constructor () {
     super([
        {
          title: 'Teclado bluetooth Logitech K380 QWERTY español color negro  ',
          description: 'Innovadores en diseño y tecnología, Logitech se encarga de brindar la mejor experiencia de uso para sus usuarios. Sus teclados resaltan por ser resistentes y muy de buena calidad, por lo que podrás disfrutarlos por un largo tiempo.  ',
          price: 4399,
          stock: 26,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_758918-MLA46869090083_072021-O.webp  ',
          category: 'teclados',
          timestamp: '23/3/2022 15:53:45',
          id: "fe421f101be95eabce1c"
        },
        {
          title: '6FC5203-0AF20-0AA1 Siemens ',
          description: 'TECLADO COMPLETO CNC SINUMERIK KB 483C, ANCHO 19 LLAVES MECANICAS INCL. CABLE DE 1,5 M SKU:6FC52030AF200AA1 ',
          price: 237265,
          stock: 8,
          photo: 'https://ar.wiautomation.com/168423-large_default/6FC52030AF200AA1.jpg ',
          category: 'teclados',
          timestamp: '25/3/2022 12:03:27',
          id: "0b95ae7c0dbcf28c0e86"
        },
        {
          title: 'Teclado Multimedia Compacto Iqual Kb502 Pc Notebook Oficina',
          description: 'TECLADO MULTIMEDIA COMPACTO IQUAL KB502 USB EN ESPAÑOL KB502',
          price: 379,
          stock: 52,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_971168-MLA46416069196_062021-O.webp',
          category: 'teclados',
          timestamp: '23/3/2022 9:57:03',
          id: "b538c7707a98cdf85f04"
        },
        {
          title: 'Monitor Gamer 24 24p Led 1080p Full Hd Hdmi Daewoo Dw-mon24',
          description: 'Monitor gamer 24 pulgadas',
          price: 23550,
          stock: 2,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_638132-MLA48799047543_012022-O.webp',
          category: 'monitores',
          timestamp: '25/3/2022 12:03:27',
          id: "b8e16e042c41f7db3d97"
        },
        {
          title: 'Samsung Monitor C27T550FDR 27´´ Full HD LED Curvo 75Hz',
          description: 'Presentamos la curva más atrevida jamás lograda. Este hito, nacido de años de innovación incesante, cambia la forma de la pantalla visual y es pionero en el futuro de la tecnología de monitores.',
          price: 35793,
          stock: 8,
          photo: 'https://www.tradeinn.com/f/13816/138163335/samsung-monitor-c27t550fdr-27-full-hd-led-curvo-75hz.jpg',
          category: 'monitores',
          timestamp: '23/3/2022 10:00:32',
          id: "bcaaf14074efb195883e"
        },
        {
          title: 'Monitor Monocromatico - Sunshine De 14 - Svga - Blanco',
          description: ' Monitor monocromatico 14" fosforo blanco, de 1996 en muy buen estado. Incluye base pivotante y cable de power Le falta limpieza.',
          price: 6900,
          stock: 1,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_948351-MLA47095355573_082021-O.webp',
          category: 'monitores',
          timestamp: '23/3/2022 10:02:03',
          id: "20d0c5bb976641d6c2c8"
        },
        {
          title: 'Mouse inalámbrico Logitech M170 gris y negro',
          description: 'Los mouses Logitech se adaptan a la forma de tu mano para proporcionarte horas de comodidad. Sin necesidad de mover el brazo para deslizar el cursor, tu mano se fatigará menos. Son ideales para cualquier espacio de trabajo y quienes tienen la mesa llena de diversos objetos.',
          price: 1000,
          stock: 32,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_891822-MLA32146214292_092019-O.webp',
          category: 'mouses',
          timestamp: '23/3/2022 10:04:14',
          id: "4d2c5cea670b12621d19"
        },
        {
          title: 'Mouse de juego inalámbrico recargable Logitech G Series Lightspeed G502 negro',
          description: 'Ahora puedes jugar con más rapidez y precisión con G502 LIGHTSPEED, dotado de conectividad inalámbrica superrápida de 1 ms. Un sensor HERO de próxima generación ofrece rendimiento de 16.000 dpi y eficiencia energética superiores, dándote hasta 60 horas de juego ininterrumpido.',
          price: 10491,
          stock: 21,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_943772-MLA40076329951_122019-O.webp',
          category: 'mouses',
          timestamp: '23/3/2022 10:05:13',
          id: "0ad76559fe1d1dd01725"
        },
        {
          title: 'Apple Magic Mouse 2 Plateado',
          description: 'El Magic Mouse 2 es totalmente recargable para que no tengas que usar las baterías tradicionales. Es más liviano, tiene menos piezas gracias a la batería integrada y a su base uniforme, y la parte inferior ha sido optimizada, por eso se mueve por tu escritorio con mayor fluidez y menos resistencia. Además, la superficie Multi-Touch te permite hacer gestos sencillos para pasar de una página web a otra y desplazarte por documentos. El Magic Mouse 2 está listo para usarse desde el primer día y se conecta a tu Mac de forma automática.',
          price: 15699,
          stock: 9,
          photo: 'https://http2.mlstatic.com/D_NQ_NP_966523-MLA46403656594_062021-O.webp',
          category: 'mouses',
          timestamp: '23/3/2022 10:06:27',
          id: "34f81995610884980acb"
        }
      ])
 }
};

export default ProductDaoMemory;