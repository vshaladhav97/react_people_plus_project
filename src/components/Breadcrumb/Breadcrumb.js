import { React,useMemo } from 'react'
import './Breadcrumb.scss'
import { Link } from 'react-router-dom';

const Breadcrumb = ({
  routes,
  separator='/',
  classes=''
  }) => {
  const pathname  = window.location.pathname;
  const currRoutes = useMemo(() => {
    return pathname.slice(1).split('/');
    }, [pathname]);

  let routeResolved = '';

  return (
    <>
      <div className={`breadcrumb ${classes}`}>
      {
      currRoutes.map((route, idx) => {
        const currRoute = routes.find((val) => val.key === route);
        routeResolved = routeResolved.concat(`/${currRoute?.key}`);
        return (
            <div key={route} style={{display: 'inline'}}>
              {currRoute?.icon && <img src={currRoute.icon} alt={currRoute.key} className='breadcrumb-icon'/>}
              <Link to={`${routeResolved}`} className='breadcrumb-link'>{currRoute?.label}</Link>
              { idx !== currRoutes.length - 1 && ( <span className="breadcrumb-separator"> {separator} </span>) }
            </div>
          )
        })
      }
    </div>
    </>
  )
}

export default Breadcrumb