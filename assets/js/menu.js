/* ══════════════════════════════════════════════════
   YUKI — FINE DINING, BANGALORE
   MENU PAGE SPECIFIC JS (menu.js)
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── MENU COURSE FILTERING SYSTEM ───
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseRows = document.querySelectorAll('.course-row');

  if (filterButtons.length && courseRows.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter; // 'all', 'vg', 'gf', 'df', 'sp'

        courseRows.forEach(row => {
          if (filterValue === 'all') {
            row.classList.remove('filtered-out');
            return;
          }

          // Check if row has a matching tag class
          // e.g. for 'vg', we look for an element with class '.tag.vg' inside the row
          const hasMatchingTag = row.querySelector(`.tag.${filterValue}`);
          if (hasMatchingTag) {
            row.classList.remove('filtered-out');
          } else {
            row.classList.add('filtered-out');
          }
        });
      });
    });
  }


  // ─── INTERACTIVE DISH DETAILS DRAWER SYSTEM ───
  const drawer = document.getElementById('dish-drawer');
  const backdrop = document.getElementById('dish-drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');

  // Detailed Course Database (Roman Numeral mapping)
  const dishDatabase = {
    'I': {
      title: 'Amuse-Bouche',
      subtitle: 'Chef\'s Surprise · Changes Daily',
      desc: 'Our evening starts with a single, unrepeatable bite designed to stimulate the senses and awaken the palate. Crafted by the chef each morning using whatever premium fresh items the local markets yielded that day.',
      ingredients: 'Changes daily. Focuses on seasonal Indian forest flora and fresh coastal catches.',
      allergens: 'Varies daily. Please advise your server.',
      wine: 'Pair: Welcome House mocktail or Blanc de Blancs Champagne',
      image: 'cuisine.png'
    },
    'II': {
      title: 'Dashi · Kaveri Caviar · Yuzu',
      subtitle: 'Cold Course',
      desc: 'Cold-set kombu dashi gel topped with a delicate dollop of Kaveri caviar, an airy house-made yuzu foam, pickled pearl onion, and micro shiso. A minimalist, clean study of oceanic depth and citric high notes.',
      ingredients: 'Kombu dashi gel, Kaveri caviar, yuzu juice, pickled pearl onion, micro shiso leaves.',
      allergens: 'Gluten-Free, Dairy-Free. Contains Seafood/Fish.',
      wine: 'Pair: Blanc de Blancs Champagne (Champagne, France)',
      image: 'menu1.avif'
    },
    'III': {
      title: 'Sashimi — Hamachi · Ponzu · Jalapeño',
      subtitle: 'Raw Course',
      desc: 'Day-boat yellowtail hamachi, flown in fresh from Kyushu Prefecture three times weekly. Sliced to exactly 4mm, dressed in our 48-hour house-infused citrus ponzu, finished with a precise drop of house-pressed Bangalore green chilli oil and a delicate dusting of frozen sesame snow.',
      ingredients: 'Kyushu yellowtail hamachi, citrus ponzu (sudachi & yuzu), local green chilli oil, sesame powder.',
      allergens: 'Gluten-Free, Dairy-Free. Contains Fish, Sesame.',
      wine: 'Pair: Grüner Veltliner (Wachau, Austria)',
      image: 'menu7.avif'
    },
    'IV': {
      title: 'Chawanmushi · Hokkaido Scallop · Truffle',
      subtitle: 'Warm Custard',
      desc: 'A silken, warm egg custard steamed to delicate, wobble-point perfection. Embedded with a gently seared Hokkaido giant sea scallop and finished with shaved Périgord black truffle. Pour-over dashi broth is served tableside.',
      ingredients: 'Organic chicken eggs, dashi stock, Hokkaido scallop, shaved Périgord black truffle.',
      allergens: 'Gluten-Free, Dairy-Free. Contains Shellfish, Egg.',
      wine: 'Pair: White Burgundy (Meursault, France)',
      image: 'bar_menu2.avif'
    },
    'V': {
      title: 'Uni Pasta · Shiso Butter · Bottarga',
      subtitle: 'Pasta Course',
      desc: 'House-kneaded fresh egg yolk pasta tossed in an incredibly rich sea urchin cream made from Santa Barbara red uni and cultured shiso leaf butter. Finished at the pass with finely shaved cured grey mullet bottarga and fresh lemon zest.',
      ingredients: 'Hand-rolled egg pasta, Santa Barbara sea urchin, cultured butter, shiso leaves, cured mullet bottarga.',
      allergens: 'Vegetarian Option Available. Contains Gluten, Dairy, Seafood.',
      wine: 'Pair: Chablis Premier Cru (Burgundy, France)',
      image: 'menu5.avif'
    },
    'VI': {
      title: 'Sorbet Interlude · Yuzu · Shiso',
      subtitle: 'Palate Cleanser',
      desc: 'A refreshing transition course designed to cleanse the palate before the main course. A single, tart scoop of frozen yuzu sorbet rested on a candied shiso leaf, finished with a drizzle of 10-year-aged dark rice vinegar.',
      ingredients: 'Yuzu juice, organic sugar, fresh green shiso leaf, aged rice vinegar.',
      allergens: 'Vegetarian, Gluten-Free, Dairy-Free.',
      wine: 'Complimentary Palate Cleanser',
      image: 'bar_menu3.avif'
    },
    'VII': {
      title: 'Langoustine · Dashi Butter · Ikura',
      subtitle: 'Seafood Main',
      desc: 'Sweet Scottish langoustine tail poached gently in house-churned dashi butter. Presented over a smooth, sweet purée of organic Karnataka golden corn, and crowned with hand-cured bright salmon ikura pearls.',
      ingredients: 'Scottish langoustine, butter, dashi extract, sweet corn, cured salmon roe (ikura).',
      allergens: 'Gluten-Free. Contains Shellfish, Dairy, Fish.',
      wine: 'Pair: White Rioja (Rioja, Spain)',
      image: 'menu6.avif'
    },
    'VIII': {
      title: 'A5 Wagyu · Black Truffle · Aged Soy',
      subtitle: 'Meat Course · Signature',
      desc: 'The pinnacle of our hot kitchen. Hokkaido A5 Wagyu sirloin, rested and seared over binchotan charcoal, then sliced tableside. Served with a deeply savory Périgord black truffle XO sauce, brushed with a reduction of 10-year aged tamari soy sauce, and accented with chrysanthemum petals.',
      ingredients: 'Hokkaido A5 Wagyu beef, Périgord black truffles, 10-year aged tamari, chrysanthemums.',
      allergens: 'Gluten-Free, Dairy-Free. Contains Soy.',
      wine: 'Pair: Barolo DOCG (Piedmont, Italy)',
      image: 'menu2.avif'
    },
    'IX': {
      title: 'Seasonal Rice · Mushroom · Dashi',
      subtitle: 'Rice Course',
      desc: 'Cooked in a traditional clay donabe pot, premium Japanese short-grain rice is infused with a rich broth made from a medley of seasonal Western Ghats forest mushrooms. Topped with a rich, creamy 63-degree sous-vide egg yolk and truffle shavings.',
      ingredients: 'Japanese short-grain rice, wild forest mushrooms, dashi broth, organic egg yolk, white truffle oil.',
      allergens: 'Vegetarian, Gluten-Free. Contains Egg.',
      wine: 'Pair: Aged Sake (Niigata, Japan)',
      image: 'bar_menu4.avif'
    },
    'X': {
      title: 'Pre-Dessert · Coconut · Pandan',
      subtitle: 'Light Dessert',
      desc: 'A light, refreshing dessert serving as a bridge to sweetness. Silken coconut pannacotta infused with local coconut milk, dressed with bright green cold-pressed pandan oil, toasted coconut flakes, and a caramelised banana slice.',
      ingredients: 'Coconut milk, gelatin, pandan leaf extract, organic banana, cane sugar.',
      allergens: 'Vegetarian, Gluten-Free, Dairy-Free.',
      wine: 'Pair: Tokaji Aszú (Tokaj, Hungary)',
      image: 'bar_menu5.avif'
    },
    'XI': {
      title: 'Mochi · Kerala Cardamom · Sakura',
      subtitle: 'Dessert · Signature',
      desc: 'A beautiful collision of cultures. Pillowy, hand-pounded mochi rice cake filled with a fragrant ice cream infused with fresh green cardamom from Idukki, Kerala. Served over a pool of translucent sakura gel and decorated with edible gold leaf.',
      ingredients: 'Glutinous rice flour, Kerala green cardamom, milk, sakura flower extract, gold leaf.',
      allergens: 'Vegetarian, Gluten-Free. Contains Dairy.',
      wine: 'Pair: Junmai Daiginjo (Kyoto, Japan)',
      image: 'menu3.avif'
    },
    'XII': {
      title: 'Mignardises & Farewell Tea',
      subtitle: 'The Final Note',
      desc: 'A concluding curation of sweet bites to accompany your warm beverage. Includes a dark chocolate bonbon filled with sweet miso caramel, a sugar-dusted yuzu fruit jelly, and a crisp roasted sesame praline. Served alongside premium loose-leaf Japanese sencha or houjicha.',
      ingredients: 'Miso caramel, Belgian dark chocolate, yuzu pectin, roasted sesame seeds, imported Japanese green tea.',
      allergens: 'Vegetarian. Contains Dairy, Sesame, Soy.',
      wine: 'Pair: Selected Japanese Sencha, Gyokuro, or Houjicha',
      image: 'menu4.avif'
    }
  };

  // Open Drawer on Row Click
  if (drawer && backdrop && courseRows.length) {
    courseRows.forEach(row => {
      row.addEventListener('click', () => {
        // Find the course Roman Numeral
        const numEl = row.querySelector('.course-num');
        if (!numEl) return;
        
        const numeral = numEl.innerText.trim();
        const data = dishDatabase[numeral];
        
        if (data) {
          // Populate drawer fields
          drawer.querySelector('.drawer-num').innerText = `Course ${numeral}`;
          drawer.querySelector('.drawer-title').innerText = data.title;
          drawer.querySelector('.drawer-subtitle').innerText = data.subtitle;
          drawer.querySelector('.drawer-desc').innerText = data.desc;
          drawer.querySelector('#drawer-ingredients').innerText = data.ingredients;
          drawer.querySelector('#drawer-allergens').innerText = data.allergens;
          
          const wineMetaEl = drawer.querySelector('#drawer-wine-pairing');
          wineMetaEl.innerText = data.wine;

          // Inject allergen tags into the tags container
          const tagRow = drawer.querySelector('.drawer-tag-row');
          tagRow.innerHTML = '';
          
          // Look at tags in the original row to duplicate in the drawer
          row.querySelectorAll('.tag').forEach(tag => {
            const clone = tag.cloneNode(true);
            tagRow.appendChild(clone);
          });

          // Set visual image
          const img = drawer.querySelector('.drawer-img-container img');
          if (img) {
            img.src = data.image;
            img.alt = data.title;
          }

          // Open drawer
          drawer.classList.add('open');
          backdrop.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close Drawer triggers
    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      // Only restore scroll if mobile menu is not open
      const mobMenu = document.getElementById('mobile-menu');
      if (!mobMenu || !mobMenu.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    };

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    
    // Close drawer on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }
});
