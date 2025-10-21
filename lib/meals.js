import { supabase } from './supabase';

// Create the meals table if it doesn't exist
async function ensureTableExists() {
  const { error } = await supabase.rpc('create_meals_table_if_not_exists');
  if (error && !error.message.includes('already exists')) {
    console.error('Error ensuring meals table exists:', error);
  }
}

// Initialize the database
ensureTableExists();

// Default meals that come with the app
const defaultMeals = [
  {
    id: 1,
    title: 'Juicy Cheese Burger',
    slug: 'juicy-cheese-burger',
    image: '/images/burger.jpg',
    summary: 'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
    instructions: `1. Prepare the patty: Mix 200g of ground beef with salt and pepper. Form into a patty.
2. Cook the patty: Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.
3. Assemble the burger: Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.
4. Serve: Complete the assembly with the top bun and serve hot.`,
    creator: 'John Doe',
    creator_email: 'johndoe@example.com',
    isDefault: true
  },
  {
    id: 2,
    title: 'Spicy Curry',
    slug: 'spicy-curry',
    image: '/images/curry.jpg',
    summary: 'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
    instructions: `1. Chop vegetables: Cut your choice of vegetables into bite-sized pieces.
2. Sauté vegetables: In a pan with oil, sauté the vegetables until they start to soften.
3. Add curry paste: Stir in 2 tablespoons of curry paste and cook for another minute.
4. Simmer with coconut milk: Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.
5. Serve: Enjoy this creamy curry with rice or bread.`,
    creator: 'Max Schwarz',
    creator_email: 'max@example.com',
    isDefault: true
  },
  {
    id: 3,
    title: 'Homemade Dumplings',
    slug: 'homemade-dumplings',
    image: '/images/dumplings.jpg',
    summary: 'Tender dumplings filled with savory meat and vegetables, steamed to perfection.',
    instructions: `1. Prepare the filling: Mix minced meat, shredded vegetables, and spices.
2. Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.
3. Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.
4. Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.`,
    creator: 'Emily Chen',
    creator_email: 'emilychen@example.com'
  },
  {
    id: 4,
    title: 'Classic Mac n Cheese',
    slug: 'classic-mac-n-cheese',
    image: '/images/macncheese.jpg',
    summary: 'Creamy and cheesy macaroni, a comforting classic that\'s always a crowd-pleaser.',
    instructions: `1. Cook the macaroni: Boil macaroni according to package instructions until al dente.
2. Prepare cheese sauce: In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.
3. Combine: Mix the cheese sauce with the drained macaroni.
4. Bake: Transfer to a baking dish, top with breadcrumbs, and bake until golden.
5. Serve: Serve hot, garnished with parsley if desired.`,
    creator: 'Laura Smith',
    creator_email: 'laurasmith@example.com'
  },
  {
    id: 5,
    title: 'Authentic Pizza',
    slug: 'authentic-pizza',
    image: '/images/pizza.jpg',
    summary: 'Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.',
    instructions: `1. Prepare the dough: Knead pizza dough and let it rise until doubled in size.
2. Shape and add toppings: Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.
3. Bake the pizza: Bake in a preheated oven at 220°C for about 15-20 minutes.
4. Serve: Slice hot and enjoy with a sprinkle of basil leaves.`,
    creator: 'Mario Rossi',
    creator_email: 'mariorossi@example.com'
  },
  {
    id: 6,
    title: 'Wiener Schnitzel',
    slug: 'wiener-schnitzel',
    image: '/images/schnitzel.jpg',
    summary: 'Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.',
    instructions: `1. Prepare the veal: Pound veal cutlets to an even thickness.
2. Bread the veal: Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.
3. Fry the schnitzel: Heat oil in a pan and fry each schnitzel until golden brown on both sides.
4. Serve: Serve hot with a slice of lemon and a side of potato salad or greens.`,
    creator: 'Franz Huber',
    creator_email: 'franzhuber@example.com'
  },
  {
    id: 7,
    title: 'Fresh Tomato Salad',
    slug: 'fresh-tomato-salad',
    image: '/images/tomato-salad.jpg',
    summary: 'A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.',
    instructions: `1. Prepare the tomatoes: Slice fresh tomatoes and arrange them on a plate.
2. Add herbs and seasoning: Sprinkle chopped basil, salt, and pepper over the tomatoes.
3. Dress the salad: Drizzle with olive oil and balsamic vinegar.
4. Serve: Enjoy this simple, flavorful salad as a side dish or light meal.`,
    creator: 'Sophia Green',
    creator_email: 'sophiagreen@example.com'
  }
];

// Initialize default meals if needed
async function initializeDefaultMeals() {
  const { data: existingMeals } = await supabase
    .from('meals')
    .select('id')
    .limit(1);

  if (!existingMeals || existingMeals.length === 0) {
    const { error } = await supabase
      .from('meals')
      .insert(defaultMeals);
    
    if (error) {
      console.error('Error initializing default meals:', error);
    }
  }
}

// Run initialization
initializeDefaultMeals();

export async function getMeals() {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading meals:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error loading meals:', error);
    return [];
  }
}

export async function getMeal(slug) {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error finding meal:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error finding meal:', error);
    return null;
  }
}

export async function saveMeal(meal) {
  try {
    const newMeal = {
      ...meal,
      slug: meal.slug || meal.title.toLowerCase().replace(/\s+/g, '-'),
      image: meal.image || '/images/placeholder.jpg',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('meals')
      .insert([newMeal])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: 'Meal saved successfully!',
      data: data,
      shouldRedirect: true
    };
  } catch (error) {
    console.error('Error saving meal:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to save meal. Please try again.',
      shouldRedirect: false
    };
  }
}
