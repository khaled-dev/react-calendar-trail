import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form } from 'react-bootstrap';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', start: '', end: '' });

    const handleDateSelect = (selectInfo) => {
        setFormData({
            title: '',
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        setShowModal(true);
    };

    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
            clickInfo.event.remove();
        }
    };

    const handleEventAdd = () => {
        setEvents([
            ...events,
            {
                title: formData.title,
                start: formData.start,
                end: formData.end,
                id: new Date().getTime(), // unique ID for the event
            },
        ]);
        setShowModal(false);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                selectMirror={true}
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                editable={true}
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
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
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

export default Calendar;