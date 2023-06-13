import React, { useState, useEffect, useRef } from 'react'
import './Wizard.scss'
import Button from '../Button'
import useWindowResize from '../../hooks/useWindowResize'
import successIcon from '../../assets/images/success.svg';
import failedIcon from '../../assets/images/failed.svg';
const Wizard = ({
 header = 'Wizard Header sample',
 subHeader = 'This information will let us know more about you.',
 tabContent, 
 finishHandler,
 className = {}, 
 reference }) => {
 // console.log("tabContent", tabContent)
 const ref = useRef(null);
 const [tabIndex, settabIndex] = useState(0);
 const [tabWidth, setTabWidth] = useState(0);
 const [movingTabLeft, setMovingTabLeft] = useState(0);
 const [movingBtnText, setMovingBtnText] = useState(tabContent[tabIndex].title || '');

 const tabClickHandler = (index, title) => {
  settabIndex(index);
  let mtl = tabWidth * index;
  setMovingTabLeft(mtl);
  setMovingBtnText(title);
  if(index>0) tabContent[index-1].setTabStatus(1);
 }

 useEffect(() => {
  let _width = ref.current ? ref.current.offsetWidth : 0;
  let _tabWidth = _width / tabContent.length;
  setTabWidth(_tabWidth-50);
  setMovingTabLeft(_tabWidth * tabIndex);
 }, [tabContent, tabIndex])

 const onPreviousBtnClickHandler = () => {
  // console.log("onPreviousBtnClickHandler",tabIndex)
  let prevIndex = tabIndex - 1;
  if (prevIndex >= 0) {
   settabIndex(prevIndex);
   setMovingBtnText(tabContent[prevIndex].title)
  }
 }

 const onNextBtnClickHandler = () => {
  // console.log("onNextBtnClickHandler",tabIndex)
  let nextIndex = tabIndex + 1;
  if (nextIndex < tabContent.length) {
   settabIndex(nextIndex);
   setMovingBtnText(tabContent[nextIndex].title);
   tabContent[tabIndex].setTabStatus(1);
  }
  else {
    console.log("finish button")
    finishHandler()
  }
 }
 const setTabPosition = () => {
  let _width = ref.current ? ref.current.offsetWidth : 0;
  let _tabWidth = _width / tabContent.length;
  setTabWidth(_tabWidth-26);
  setMovingTabLeft(_tabWidth * tabIndex);
 }
 const selectSrc = ['',successIcon,failedIcon];
 useWindowResize(setTabPosition);
 const TitleComponent = (props) => <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  <div> {props.title}</div>
  {
   <img className='tab-validation-icon' src={selectSrc[props.tabStatus]} alt={selectSrc[props.tabStatus]}></img>
  }
 
</div>
 return (
  <div
   className={`wizard-container  ${className.wizardContainer || ''}`}
   ref={reference}
  >
   <div className={`wizard-container-header  ${className.wizardHeader || ''}`}>
    {header}
   </div>
   <div className={`wizard-container-sub-header  ${className.wizardSubHeader || ''}`}>
    {subHeader}
   </div>
   <div className='wizard-button-container' ref={ref}>
    {
     tabContent && tabContent.map((item, index) => {
      return <Button key={index} isDisabled={!item.isEnabled} classes='wizard-tab-buttons' onClick={() => {
       if (item.isEnabled) tabClickHandler(index, item.title);
      }}> <TitleComponent title={item.title} tabStatus={item.tabStatus}/></Button>
     })
    }
    <div className="wizard-card-moving-tab" style={{
     width: `${tabWidth}px`, transform: `translate3d(${movingTabLeft}px, 0px, 0px)`,
     transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1) 0s'
    }}>{movingBtnText}</div>
   </div>
   <div className='wizard-content-container'>
    {tabContent && tabContent[tabIndex].content}
   </div>
   <div className='wizard-footer-buttons-container'>
    {
     tabIndex && <Button text={tabContent[tabIndex].previousBtnTitle} classes='button-primary button-small wizard-btns' onClick={() => onPreviousBtnClickHandler()}> </Button>
    }
    <Button text={tabContent[tabIndex].nextBtnTitle} isDisabled={!tabContent[tabIndex].isValidated} classes='button-primary button-small wizard-btns' onClick={() => onNextBtnClickHandler()}> </Button>
   </div>
  </div>
 )
}

export default React.memo(Wizard)
