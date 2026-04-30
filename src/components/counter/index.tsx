import { useEffect, useRef, useState } from 'preact/hooks';
import gsap from 'gsap';

function Counter() {
  const container = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      gsap.set(container.current, { transformOrigin: '50% 50%' });
    }, container);

    return () => ctx.revert();
  }, []);

  const onClick = () => {
    if (!container.current) return;
    gsap.to(container.current, {
      rotation: '+=360',
      duration: 1,
      ease: 'power2.out',
    });
  };

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue((v) => v + 1)}>Increment</button>
      <button onClick={() => setValue((v) => v - 1)}>Decrement</button>

      <div className="box" ref={container}>
        <p>Animate me!</p>
      </div>

      <button onClick={onClick}>Animate</button>
    </>
  );
}

export default Counter;