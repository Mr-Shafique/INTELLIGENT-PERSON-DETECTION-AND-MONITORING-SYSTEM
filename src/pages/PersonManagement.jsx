import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import { api } from '../utils/api';

const PersonManagement = () => {
  const [persons, setPersons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 'allowed',
    image: 'https://via.placeholder.com/150',
  });

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await api.getPersons();
      setPersons(response.data);
    } catch (error) {
      toast.error('Error fetching persons: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPerson) {
        await api.updatePerson(selectedPerson.id, formData);
        toast.success('Person updated successfully');
      } else {
        await api.addPerson(formData);
        toast.success('Person added successfully');
      }
      setIsModalOpen(false);
      fetchPersons();
    } catch (error) {
      toast.error('Error saving person: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await api.deletePerson(id);
        toast.success('Person deleted successfully');
        fetchPersons();
      } catch (error) {
        toast.error('Error deleting person: ' + error.message);
      }
    }
  };

  const openModal = (person = null) => {
    setSelectedPerson(person);
    setFormData(
      person
        ? { ...person }
        : {
            name: '',
            status: 'allowed',
            image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Person Management</h1>
        <Button onClick={() => openModal()}>Add New Person</Button>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => (
                <tr key={person.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={person.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                      alt={person.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {person.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        person.status === 'allowed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(person.lastSeen).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(person)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPerson ? 'Edit Person' : 'Add New Person'}
          </h2>
          <InputField
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="allowed">Allowed</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedPerson ? 'Update' : 'Add'} Person
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonManagement;