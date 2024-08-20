import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const formInitialState = {
        title: '',
        number_of_pax: 0,
        price: '{"key": "value"}',
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

    // for details
    const handleSelectEvent = (event) => {
        // if (window.confirm(`Are you sure you want to delete the event '${event.title}'?`)) {
        //     setEvents(events.filter(e => e !== event));
        // }

        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const handleEventDelete = () => {
        setEvents(events.filter(e => e !== selectedEvent));
        setShowDetailsModal(false);
    };

    // for color
    const eventPropGetter = (event) => {
        const backgroundColor = event.color || 'lightblue'; // Default color if not set
        return { style: { backgroundColor } };
    };

    // for submiting
    const handleEventAdd = () => {
        // loop over [date range]
        const newEvents = formData.dateRange.map((date) => {
            const [teeHour, teeMinute] = formData.tee_time?.split(':');
            const teeTime = date.clone().set({ hour: teeHour, minute: teeMinute }).toDate();

            const start = date.clone().set({ hour: teeHour, minute: teeHour }).toDate();
            const end = date.clone().set({ hour: teeHour, minute: teeHour }).toDate();

            return {
                title: formData.title,
                number_of_pax: formData.number_of_pax,
                price: formData.price,
                notes: formData.notes,
                tee_time: teeTime,
                is_public_holiday: formData.is_public_holiday,
                start,
                end,
                color: formData.is_public_holiday === true ? 'red' : 'blue', // Set color based on title
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
                eventPropGetter={eventPropGetter}
                style={{ height: 600 }}
            />

            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)}>Add Event</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="number_of_pax">Number Of Pax</Label>
                            <Input
                                id="number_of_pax"
                                type="number"
                                value={formData.number_of_pax}
                                onChange={(e) => setFormData({ ...formData, number_of_pax: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                id="price"
                                type="textarea"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="notes">Notes</Label>
                            <Input
                                id="notes"
                                type="textarea"
                                bsSize="lg"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="tee_time">Tee Time</Label>
                            <Input
                                id="tee_time"
                                type="time"
                                value={formData.tee_time}
                                onChange={(e) => setFormData({ ...formData, tee_time: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="is_public_holiday">Is Holiday</Label>
                            <Input
                                id="is_public_holiday"
                                type="checkbox"
                                value={formData.is_public_holiday}
                                onChange={(e) => setFormData({ ...formData, is_public_holiday: e.target.checked })}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEventAdd}>
                        Save Event
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={showDetailsModal} toggle={() => setShowDetailsModal(false)}>
                <ModalHeader toggle={() => setShowDetailsModal(false)}>Event Details</ModalHeader>
                <ModalBody>
                        {selectedEvent && (
                            <>
                                <p><strong>Title:</strong> {selectedEvent.title} </p>
                                <p><strong>Number Of Pax:</strong> {selectedEvent.number_of_pax}</p>
                                <p><strong>Price:</strong> {selectedEvent.price}</p>
                                <p><strong>Notes:</strong> {selectedEvent.notes}</p>
                                <p><strong>Tee Time:</strong> {moment(selectedEvent.start).format('h:mm a')}</p>
                                <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}</p>
                                <p><strong>is Public Holiday:</strong> {selectedEvent.is_public_holiday.toString()}</p>
                            </>
                        )}
                    </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleEventDelete}>
                        Delete Event
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default MyCalendar;