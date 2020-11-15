import React from "react";
import { useKeenSlider } from "keen-slider/react";
import classnames from "classnames";
import "keen-slider/keen-slider.min.css";

export default function DishPicturesSlider({ pictures }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  return (
    <>
      <div className="relative">
        <div ref={sliderRef} className="keen-slider">
          {pictures.map(pic => (
            <div key={pic.id} className="keen-slider__slide">
              <img src={pic.path} />
            </div>
          ))}
        </div>
        {slider && (
          <>
            <LeftArrowSpace>
              <button onClick={() => slider.prev()}>{"<"}</button>
            </LeftArrowSpace>
            <RightArrowSpace>
              <button onClick={() => slider.next()}>{">"}</button>
            </RightArrowSpace>
          </>
        )}
      </div>
      {slider && (
        <div className="flex justify-center p-2">
          {[...Array(slider.details().size).keys()].map(idx => (
            <button
              key={idx}
              onClick={() => slider.moveToSlideRelative(idx)}
              className={
                "rounded-full w-3 h-3 mr-2 " +
                (currentSlide === idx ? "bg-gray-800" : "bg-gray-500")
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

const LeftArrowSpace = ({ className, ...props }) => (
  <ArrowSpace className={classnames("left-0 ml-2", className)} {...props} />
);
const RightArrowSpace = ({ className, ...props }) => (
  <ArrowSpace className={classnames("right-0 mr-2", className)} {...props} />
);
const ArrowSpace = ({ className, ...props }) => (
  <div
    className={classnames(
      "absolute text-2xl inset-y-0 flex justify-center items-center",
      className
    )}
    {...props}
  />
);
