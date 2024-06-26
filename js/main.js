// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { createClient } from '@supabase/supabase-js'

import { setRouter } from './router/router'; //router para dile mo gawas if naka login na

setRouter();



// Create a single supabase client for interacting with your database
const supabase = createClient('https://plsyfklzwmasyypcuwei.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc3lma2x6d21hc3l5cGN1d2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MDMxMzAsImV4cCI6MjAyMzQ3OTEzMH0.YTmmu_q2bXhccWjUpiGQ-mXaa_eHNA5bxluCJ7cBjbM');

 //function
 function successNotification(message, seconds = 0){
    document.querySelector(".alert-success").classList.remove("d-none");
    document.querySelector(".alert-success").classList.add("d-block");
    document.querySelector(".alert-success").innerHTML = message;

    if (seconds != 0){
        setTimeout (function(){
            document.querySelector(".alert-success").classList.remove("d-block");
            document.querySelector(".alert-success").classList.add("d-none");
        },seconds * 1000);
    }
}

function errorNotification(message, seconds = 0){
    document.querySelector(".alert-danger").classList.remove("d-none");
    document.querySelector(".alert-danger").classList.add("d-block");
    document.querySelector(".alert-danger").innerHTML = message;

    if (seconds != 0){
        setTimeout (function(){
            document.querySelector(".alert-danger").classList.remove("d-block");
            document.querySelector(".alert-danger").classList.add("d-none");
        },seconds * 1000);
    }
}

// Logout Function
async function doLogout() {
    // Supabase Logout
    let { error } = await supabase.auth.signOut();

    if (error == null) {
      successNotification("Logout Successfully!");
  
      // Clear local Storage
      localStorage.clear();
  
      // Redirect to login page
      window.location.pathname = "/index.html";
    } else {
      errorNotification("Logout Failed!", 15);
    }
  }

  /* function for ratings  */
  async function countUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles') // Replace 'users' with your actual table name
        .select('count');
  
      if (error) {
        console.error('Error fetching count:', error.message);
        return null; // Handle the error as needed
      }
  
      const userCount = data[0].count;
      return userCount;
    } catch (error) {
      console.error('Error:', error.message);
      return null; // Handle the error as needed
    }
  }

 /* animations effects */
  document.addEventListener("DOMContentLoaded", function() {
    // Function to check if an element is in the viewport
    function isInViewport(element) {
      var rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    // Function to add show3 class to elements in viewport
    function showInView() {
      var elements = document.querySelectorAll('.hiddenAnimate3');
  
      elements.forEach(function(element) {
        if (isInViewport(element)) {
          element.classList.add('show3');
        }
      });
    }
  
    // Initial check when the page loads
    showInView();
  
    // Check again on scroll
    window.addEventListener('scroll', showInView);
  });

  function showHiddenElements2() {
    // Get all elements with the class hiddenAnimate2
    const hiddenElements = document.querySelectorAll('.hiddenAnimate3');
    
    // Loop through each hidden element
    hiddenElements.forEach(element => {
      // Add the delayedFadeIn class after a delay of 1000 milliseconds (1 second)
      setTimeout(() => {
        element.classList.add('delayedFadeIn');
      }, 1000);
    });
  }
  document.addEventListener('DOMContentLoaded', showHiddenElements2);
 /* animations effects */

export {supabase,successNotification,errorNotification,doLogout,countUsers};
