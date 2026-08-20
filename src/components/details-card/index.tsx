type OnClick = 
  | {
    onClick: () => void;
    href?: never;
    newPage?: never;
  }
  | {
    href: string;
    newPage?: boolean;
    onClick?: never;
  };

type Button = {
  text: string;
} & OnClick;

type Props = {
  id?: string;
  title: string;
  details: string;
  button: Button;
  secondaryButton?: Button;
  img: string;
};

const DetailsCard = ({ id, title, details, button, secondaryButton, img }: Props) => {
  return (
    <div
      id={id}
      class="relative font-(family-name:--font-inter) w-[90svw] h-auto sm:w-lg md:w-3xl lg:w-4xl xl:w-240 max-w-full sm:h-100 bg-orange-pastel-light rounded-2xl border-orange-pastel-light border-4 shadow-lg overflow-hidden grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 mt-6 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
    >
      <div
        id="data-col"
        class="flex flex-col items-center sm:items-start justify-start gap-2 p-2 sm:p-8 pt-4 pr-2"
      >
        <h3
          class="text-3xl sm:text-4xl lg:text-[3.1rem] font-bold font-(family-name:--font-roca) text-purple-pastel"
        >
          {title}
        </h3>
        <p
          class="text-center sm:text-left text-pretty text-base sm:text-lg lg:text-xl lg:pb-10 w-full lg:w-96"
        >
          {details}
        </p>
        <div class="flex flex-col gap-3 sm:mt-auto lg:mt-0 md:flex-row-reverse mt-2 font-(family-name:--font-providence) text-base md:text-lg lg:text-xl">
          {button.onClick ? (
            <button
              onClick={button.onClick}
              class="px-6 py-2 cursor-pointer bg-purple-pastel text-white rounded-full hover:bg-purple-pastel-dark/90 transition-colors duration-300"
            >
              {button.text}
            </button>
          ) : null}
          {button.href ? (
            <a
              href={button.href}
              target={button.newPage ? '_blank' : '_self'}
              class="px-6 py-2 cursor-pointer bg-purple-pastel text-white rounded-full hover:bg-purple-pastel-dark/90 transition-colors duration-300"
            >
              {button.text}
            </a>
          ) : null}
          
          {secondaryButton?.onClick ? (
            <button
              onClick={secondaryButton.onClick}
              class="px-6 py-2 cursor-pointer bg-mauve-200 text-mauve-950 rounded-full hover:bg-mauve-300 transition-colors duration-300"
            >
              {secondaryButton.text}
            </button>
          ) : null}
          {secondaryButton?.href ? (
            <a
              href={secondaryButton.href}
              target={secondaryButton.newPage ? '_blank' : '_self'}
              class="px-6 py-2 cursor-pointer bg-mauve-200 text-mauve-950 rounded-full hover:bg-mauve-300 transition-colors duration-300"
            >
              {secondaryButton.text}
            </a>
          ) : null}
        </div>
      </div>

      <div
        id="image-col"
        class="w-full h-80 sm:w-auto sm:h-full sm:max-h-98 sm:ml-auto rounded-lg overflow-hidden"
        style={{ cornerShape: 'squircle' }}
      >
        <img src={img} alt="Recipe" class="h-full w-full object-cover aspect-4/3" />
      </div>
    </div>
  );
};

export default DetailsCard;
