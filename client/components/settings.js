import React from 'react';
import { useEffect, useState } from 'react';

const SettingsPage = () => {
  return (
    <div>
      <form novalidate>
        <label for='username'></label>
        <input type='text' />

        <label for='email'></label>
        <input type='text' />

        <label for='password'></label>
        <input type='text' />
        <label for='newsletters'></label>
        <input type='button' />
        <label for='text notifications'></label>
        <input type='button' />
        <label for='address'></label>
        <input type='text' />
        <label for='city'></label>
        <input type='text' />
        <label for='state'></label>
        <input type='text' />
      </form>
    </div>
  );
};

export default SettingsPage;
