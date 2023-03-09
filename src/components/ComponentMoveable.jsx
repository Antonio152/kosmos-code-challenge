import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

export const Component = ({
    updateMoveable,
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    setSelected,
    isSelected = false,
    updateEnd,
    handleDelete,
  }) => {
    const ref = useRef();
  
    const [nodoReferencia, setNodoReferencia] = useState({
      top,
      left,
      width,
      height,
      index,
      color,
      id,
    });
  
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();
    
    const onResize = async (e) => {
      // ACTUALIZAR ALTO Y ANCHO
      let newWidth = e.width;
      let newHeight = e.height;
  
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
  
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
  
      updateMoveable(id, {
        top,
        left,
        width: newWidth,
        height: newHeight,
        color,
      });
  
      // ACTUALIZAR NODO REFERENCIA
      const beforeTranslate = e.drag.beforeTranslate;
  
      ref.current.style.width = `${e.width}px`;
      ref.current.style.height = `${e.height}px`;
  
      let translateX = beforeTranslate[0];
      let translateY = beforeTranslate[1];
  
      ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
      
      setNodoReferencia({
        ...nodoReferencia,
        translateX,
        translateY,
        top: top + translateY < 0 ? 0 : top + translateY,
        left: left + translateX < 0 ? 0 : left + translateX,
      });
    };
  
    const onResizeEnd = async (e) => {
      let newWidth = e.lastEvent?.width;
      let newHeight = e.lastEvent?.height;
  
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
  
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
  
      const { lastEvent } = e;
      const { drag } = lastEvent;
      const { beforeTranslate } = drag;

        const absoluteLeft = left + beforeTranslate[0];
        const absoluteTop = top + beforeTranslate[1];
        /* Fix translate */
        let translateX = beforeTranslate[0];
        let translateY = beforeTranslate[1];

      updateMoveable(
        id,
        {
          top: translateY < 0 ? absoluteTop + Math.abs(translateY) : absoluteTop,
          left: translateX < 0 ? absoluteLeft + Math.abs(translateX) : absoluteLeft ,
          width: newWidth,
          height: newHeight,
          color,
        },
        true
      );
         
    };

    /* random fit properly */
    const randomFit = ()=> {
        const fitValues = ["contain", "cover", "fill", "none", "scale-down"]
        return fitValues[Math.floor(Math.random() * fitValues.length)]
    }
  
    return (
      <div>
        <div
          ref={ref}
          className="draggable"
          id={"component-" + id}
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: width,
            height: height,
            background: color,
          }}
          onClick={() => setSelected(id)}
        >
        {/* ========= 
            NOTA: La url de las imagenes es la misma que la que se me compartio 
            en el documento, unicamente uso la URL de "jsonplaceholder/photos" 
            para generar las imagenes 
          ======== */}
        <img
          width={width}
          height={height}
          src={`https://via.placeholder.com/${width}x${height}.png?text=${width}x${height}`}
          alt=""
          style={{
            objectFit: randomFit(),
          }}
        />

        </div>
  
        <Moveable
          target={isSelected && ref.current}
          resizable
          draggable
          onDrag={(e) => {
            updateMoveable(id, {
              top: e.top,
              left: e.left,
              width,
              height,
              color,
            });
          }}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          keepRatio={false}
          throttleResize={1}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={false}
          zoom={1}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        />
          <button onClick={() => handleDelete(id)} 
            style={{
                position: "absolute",
                top: top,
                left: left,
          }}>x</button>
      </div>
    );
  };
  //indicador