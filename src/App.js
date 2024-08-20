import React, {useEffect, useState} from 'react';
import { Calendar, momentLocalizer,Views } from 'react-big-calendar';
import moment from 'moment';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const formInitialState = {
        title: '',
        number_of_pax: 0,
        price: 0.0,
        notes: '',
        tee_time: '',
        is_public_holiday: false,
        dateRange: [],
    }
    const [formData, setFormData] = useState(formInitialState);

    useEffect(() => {
        console.log(events)
    }, [events])

    // to handle the show
    const handleSelectSlot = ({ start, end }) => {
        const dateRange = [];
        let currentDate = moment(start);
        while (currentDate < moment(end)) {
            dateRange.push(currentDate.clone());
            currentDate.add(1, 'days');
        }
        setFormData({ ...formData, dateRange });
        setShowModal(true);
    };

    // for deletion
    const handleSelectEvent = (event) => {
        if (window.confirm(`Are you sure you want to delete the event '${event.title}'?`)) {
            setEvents(events.filter(e => e !== event));
        }
    };

    // for submiting
    const handleEventAdd = () => {
        // loop over [daterange]
        const newEvents = formData.dateRange.map((date) => {
            const [teeHour, teeMinute] = formData.tee_time.split(':');
            const teeTime = date.clone().set({ hour: teeHour, minute: teeMinute }).toDate();

            const start = date.clone().set({ hour: teeHour, minute: teeHour }).toDate();
            const end = date.clone().set({ hour: teeHour, minute: teeHour }).toDate();

            return {
                title: formData.title,
                number_of_pax: formData.number_of_pax,
                price: formData.price,
                notes: formData.notes,
                tee_time: teeTime,
                is_public_holiday: false,
                start,
                end
            };
        });

        setEvents([...events, ...newEvents]);
        setShowModal(false);
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                selectable
                defaultView="month"
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                style={{ height: 600 }}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Number Of Pax</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.number_of_pax}
                                onChange={(e) => setFormData({ ...formData, number_of_pax: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="$0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tee Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={formData.tee_time}
                                onChange={(e) => setFormData({ ...formData, tee_time: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Is Holiday</Form.Label>
                            <Form.Check
                                type="checkbox"
                                value={formData.is_public_holiday}
                                onChange={(e) => setFormData({ ...formData, is_public_holiday: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEventAdd}>
                        Save Event
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyCalendar;