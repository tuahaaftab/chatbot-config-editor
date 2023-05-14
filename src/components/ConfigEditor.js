import React, { useState } from 'react';
import './ConfigEditor.css';

function ConfigEditor({ botConfig }) {

  const [config, setConfig] = useState(botConfig);
  const [hideActions, setHideActions] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [intendedChange, setintendedChange] = useState({ name: 'AddAction' });
  const [newAction, setNewAction] = useState({ name: '', type: 'AcceptOffer', instruction: '' })
  const [updateAction, setUpdateAction] = useState({ name: '', updatedName: '', type: '', instruction: '' })
  const [deleteAction, setDeleteAction] = useState({ name: '', type: '', instruction: '' })

  const possibleActionTypes = ['AcceptOffer', 'RejectOffer', 'SubmitBotInstruction'];

  const handleExportConfig = () => {
    console.log(config);
  };

  const handleHideActions = () => {
    setHideActions(!hideActions);
  };

  const handleIntendedChangeChange = (name) => {
    setNewAction({ name: '', type: 'AcceptOffer', instruction: '' });
    setUpdateAction({ name: '', updatedName: '', type: 'AcceptOffer', instruction: '' });
    setDeleteAction({ name: '', type: '', instruction: '' });

    setintendedChange({ 'name': name });
    setErrorMessage('');
  };



  // ===================== On Change Handlers =====================

  const handleNewActionChange = (field, value) => {
    const tempAction = { ...newAction };

    if (field === 'name') {
      tempAction.name = value;
    } else if (field === 'type') {
      tempAction.type = value;
    }
    else if (field === 'instruction') {
      tempAction.instruction = value;
    }

    setNewAction(tempAction);
  };


  const handleUpdateActionChange = (field, value) => {

    const tempAction = { ...updateAction };

    if (field === 'name') {
      tempAction.name = value;

      const index = config.actions.findIndex((item) => item.name === tempAction.name);

      tempAction.updatedName = config.actions[index].name;
      tempAction.type = config.actions[index].type;
      tempAction.instruction = config.actions[index].instruction;

    } else if (field === 'updatedName') {
      tempAction.updatedName = value;
    }
    else if (field === 'type') {
      tempAction.type = value;

      if (value !== 'SubmitBotInstruction') {
        tempAction.instruction = '';
      } 
    }
    else if (field === 'instruction') {
      tempAction.instruction = value;
    }

    setUpdateAction(tempAction);
  };


  const handleDeleteActionChange = (field, value) => {
    const tempAction = { ...deleteAction };

    if (field === 'name') {
      tempAction.name = value;
    } else if (field === 'type') {
      tempAction.type = value;
    }
    else if (field === 'instruction') {
      tempAction.instruction = value;
    }

    setDeleteAction(tempAction);
  };



  // ===================== On Button Click Handlers =====================
  const handleAddNewAction = () => {
    if (newAction.name === '') {
      setErrorMessage('Action name cannot be empty');
      return;
    }

    if (newAction.type === 'SubmitBotInstruction' && newAction.instruction === '') {
      setErrorMessage('Instruction needs to be present for SubmitBotInstruction type');
      return;
    }

    if (config.actions.findIndex((item) => item.name === newAction.name) !== -1) {
      setErrorMessage('Action name already exists');
      return;
    }


    const newConfig = { ...config };
    newConfig.actions.push(newAction);
    setConfig(newConfig);
    setNewAction({ name: '', type: 'AcceptOffer', instruction: '' });

    setErrorMessage('');
  };


  const handleUpdateAction = () => {
    if (updateAction.name === '' || updateAction.updatedName === '') {
      setErrorMessage('Action name cannot be empty');
      return;
    }

    if ( updateAction.type === 'SubmitBotInstruction' && updateAction.instruction === '') {
      setErrorMessage('Instruction cannot be empty');
      return;
    }

    const newConfig = { ...config };
    const index = newConfig.actions.findIndex((item) => item.name === updateAction.name);

    const tempAction = { ...updateAction };
    tempAction.name = tempAction.updatedName;

    newConfig.actions[index] = tempAction;
    setConfig(newConfig);

    updateAction.name = updateAction.updatedName;
    setUpdateAction(updateAction);

    setErrorMessage('');
  };


  const handleDeleteAction = () => {
    if (deleteAction.name === '') {
      setErrorMessage('Action name cannot be empty');
      return;
    }

    const newConfig = { ...config };
    const index = newConfig.actions.findIndex((item) => item.name === deleteAction.name);

    if (index === -1) {
      setErrorMessage('Action not found');
      return;
    }

    newConfig.actions.splice(index, 1);
    setConfig(newConfig);
    setDeleteAction({ name: '', type: '', instruction: '' });

    setErrorMessage('');
  };



  // ===================== Render Functions =====================  

  const renderConfig = () => {
    return <div className='config-container'>

      <h1 style={{ color: 'white' }}>Current Config </h1>

      {/* Config name and version */}
      <div className='config-header'>
        <h3>Config name: {config.name}</h3>
        <h3>Config version: {config.version}</h3>
      </div>

      {/* Button to toggle show/hide actions */}
      <button className="button-style" onClick={handleHideActions}>Toggle Show/Hide Action</button>

      {/* List of actions */}
      {hideActions && (
        <div className='config-body'>

          <ul>
            {config.actions.map((action, index) => (
              <li key={index}>
                <div className='config-action'>
                  <p>Action name: {action.name}</p>
                  <p>Action type: {action.type}</p>
                  {action.type === 'SubmitBotInstruction' && (
                    <p>Instruction: {action.instruction}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  };


  const renderAddAction = () => {
    return <div>
      <div className='add-action'>

        <div>
          Action Name:
          <input
            type="text"
            value={newAction.name}
            onChange={(e) => handleNewActionChange('name', e.target.value)}
          />
        </div>

        <div>
          <label>
            Action Type:
            <select
              value={newAction.type}
              onChange={(e) => handleNewActionChange('type', e.target.value)}
            >

              {/* loop of possibleActionTypes */}
              {possibleActionTypes.map((actionType, index) => (
                <option key={index} value={actionType}>{actionType}</option>
              ))}

            </select>
          </label>
        </div>


        {newAction.type === 'SubmitBotInstruction' && (
          <div>
            <label>
              Instruction:
              <input
                type="text"
                value={newAction.instruction}
                onChange={(e) => handleNewActionChange('instruction', e.target.value)}
              />
            </label>
          </div>
        )}

      </div>
    </div>
  };


  const renderUpdateAction = () => {
    return <div>

      <div className='update-action'>
        <div>
          Current Action Name:
          <select
            value={updateAction.name}
            onChange={(e) => handleUpdateActionChange('name', e.target.value)}
          >
            <option value="">Select Action</option>
            {config.actions.map((action, index) => (
              <option key={index} value={action.name}>
                {action.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          Updated Action Name

          <input
            type="text"
            value={updateAction.updatedName}
            onChange={(e) => handleUpdateActionChange('updatedName', e.target.value)}
          />

        </div>

        <div>
          <label>
            Updated Action Type:
            <select
              value={updateAction.type}
              onChange={(e) => handleUpdateActionChange('type', e.target.value)}
            >

              {/* loop of possibleActionTypes */}
              {possibleActionTypes.map((actionType, index) => (
                <option key={index} value={actionType}>{actionType}</option>
              ))}

            </select>
          </label>
        </div>

        {updateAction.type === 'SubmitBotInstruction' && (
          <div>
            <label>
              Updated Instruction:
              <input
                type="text"
                value={updateAction.instruction}
                onChange={(e) => handleUpdateActionChange('instruction', e.target.value)}
              />
            </label>
          </div>
        )}


        {/* <button className="button-style" onClick={handleUpdateAction}>Update Action</button> */}

      </div>
    </div>
  };


  const renderDeleteAction = () => {
    return <div className='delete-action-container'>
      <div className='delete-action'>
        <div>
          Action Name:
          <select
            value={deleteAction.name}
            onChange={(e) => handleDeleteActionChange('name', e.target.value)}
          >
            <option value="">Select Action</option>
            {config.actions.map((action, index) => (
              <option key={index} value={action.name}>
                {action.name}
              </option>
            ))}
          </select>
        </div>


      </div>

    </div>
  };

  
  const renderConfigModifier = () => {
    return <div className='change-container'>

          <div className='inside-change-container'>
            <h1 style={{ color: 'white' }}>Intended Change </h1> 

            <select className="select-dropdown"
              value={intendedChange.name}
              onChange={(e) => handleIntendedChangeChange(e.target.value)}
            >
              <option value="AddAction">Add Action</option>
              <option value="UpdateAction">Update Action</option>
              <option value="DeleteAction">Delete Action</option>
            </select>
          </div>

          <div className='inside-change-container'>
            {intendedChange.name === 'AddAction' && renderAddAction()}
            {intendedChange.name === 'UpdateAction' && renderUpdateAction()}
            {intendedChange.name === 'DeleteAction' && renderDeleteAction()}

            {intendedChange.name === 'AddAction' &&
              <button className="button-style" onClick={handleAddNewAction}>Add</button>
            }
            {intendedChange.name === 'UpdateAction' &&
              <button className="button-style" onClick={handleUpdateAction}>Update</button>
            }
            {intendedChange.name === 'DeleteAction' &&
              <button className="button-style" onClick={handleDeleteAction}>Delete</button>
            }
          </div>


          {errorMessage && <div className='error-box'>Error: {errorMessage}</div>}

        </div>
  }

  return (
    <div className='config-page'>

      <div className='config-page-header'>
        <h1>Config Editor</h1>

        <div style={{alignItems:'right'}}>
          <button className="button-style" onClick={handleExportConfig}>Export Config</button>
        </div>
      </div>

      <div className='config-editor'>
        {renderConfig()}

        {renderConfigModifier()}

      </div>

    </div>

  );
}

export default ConfigEditor;
