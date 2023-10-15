// LoadLibraries.js
export const loadLibraries = async () => {
    try {
      // Dynamically load libraries for deployment
      const [three, r3f, drei] = await Promise.all([
        import('https://unpkg.com/three@r132/build/three.module.js'),
        import('https://unpkg.com/react-three-fiber@7.0.3'),
        import('https://unpkg.com/@react-three/drei@1.14.0/build/index.module.js'),
      ]);
  
      return { three, r3f, drei };
    } catch (error) {
      console.error('Error loading libraries:', error);
      return {};
    }
  };