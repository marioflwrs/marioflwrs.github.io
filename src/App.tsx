import { useEffect, useRef } from 'react';
import Experience from './experience/Experience';
import Overlay from './ui/Overlay';
import { ScrollController } from './experience/systems/ScrollController';

function App() {
  // One shared controller drives the 3D camera (via scroll position) and is handed to
  // the overlay for jump-to-section navigation.
  const controllerRef = useRef<ScrollController>(null);
  if (controllerRef.current === null) {
    controllerRef.current = new ScrollController();
  }
  const controller = controllerRef.current;

  useEffect(() => {
    controller.bindInput();
    return () => controller.unbindInput();
  }, [controller]);

  return (
    <>
      <Experience controller={controller} />
      <Overlay controller={controller} />
    </>
  );
}

export default App;
