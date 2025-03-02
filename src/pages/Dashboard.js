import { Link } from 'react-router-dom';
import Screen from '../components/Screen';
import Content from '../components/Content';
import Navbar from '../components/Navbar';
import { useGetAnalytics } from "../hooks/useAnalytics";
import Loading from "../icons/Loading";
import PatternImage from '../assets/images/pattern.jpg';

export default function Dashboard() {
	const { bookingAnalytics, userAnalytics } = useGetAnalytics();

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					
					<section className='xui-mb-3'>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{userAnalytics ? userAnalytics.data.total_users.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Users</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{bookingAnalytics ? bookingAnalytics.data.total_bookings.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Bookings</span>
								</div>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							{
								bookingAnalytics ? 
									bookingAnalytics.data.total_bookings_via_booking_status.length > 0 ? 
										bookingAnalytics.data.total_bookings_via_booking_status.map((value) => {
											return <div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
												<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
													<h3 className='xui-font-sz-180 xui-font-w-normal'>{value.total_count}</h3>
													<span className='xui-font-sz-90'>{value.booking_status} Bookings</span>
												</div>
											</div>
											
										}) 
										: <div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
											<span className='xui-font-sz-90'>No activity</span>
										  </div>
									: <Loading width="12" height="12" />
							}
							{
								bookingAnalytics ? 
									bookingAnalytics.data.booking_sum_via_booking_status.length > 0 ? 
										bookingAnalytics.data.booking_sum_via_booking_status.map((value) => {
											return <div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
												<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
													<h3 className='xui-font-sz-180 xui-font-w-normal'>${value.total_amount.toLocaleString()}</h3>
													<span className='xui-font-sz-90'>{value.booking_status} Bookings</span>
												</div>
											</div>
											
										}) 
										: <div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
											<span className='xui-font-sz-90'>No activity</span>
										  </div>
									: <Loading width="12" height="12" />
							}
						</div>
					</section>
				</Content>
			</Screen>
		</>
	);
}