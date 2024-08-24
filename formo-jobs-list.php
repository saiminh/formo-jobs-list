<?php
/**
 * Plugin Name:       Formo Jobs List
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       formo-jobs-list
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

if ( !function_exists('render_jobs_listing') ) {

  function render_jobs_listing() {
  
    $arrContextOptions=array(
      "ssl"=>array(
          "verify_peer"=>false,
          "verify_peer_name"=>false,
      ),
    );  
  
    $api_url = 'https://formo.recruitee.com/api/offers/';
  
    // Read JSON file
    $json_data = file_get_contents($api_url, false, stream_context_create($arrContextOptions));
 
    if ($json_data) {
      // Decode JSON data into PHP array
      $response_data = json_decode($json_data);
    
      // All user data exists in 'data' object
      $jobs_data = $response_data->offers;
    
      if ( !function_exists('get_city') ) {
        function get_city($job) {
          return $job->city;
        }
      }
    
      $cities = array_unique( array_map("get_city", $jobs_data) );
    
      $cities_filter = '';
      foreach($cities as $city) {
        $lowercasecity = strtolower($city);
        $spacelesscity = str_replace(' ', '-', $lowercasecity);
        $sanitized_city = str_replace( ',', '-and', $spacelesscity ); //for multiple cities
        $cities_filter = $cities_filter.'<a class="wp-block-button__link city-filter" data-cityfilter="'.$sanitized_city.'">' . $city . '</a>';
      }
    
      $joblisting= '<div class="formo-jobs-listing-filter">'.$cities_filter.'</div>';
      // Traverse array and display user data
      $joblisting = $joblisting."<ul class='wp-block-group formo-jobs-listing'>";
      foreach ($jobs_data as $job) {
        $lowercasecity = strtolower($job->city);
        $spacelesscity = str_replace(' ', '-', $lowercasecity);
        $sanitized_city = str_replace( ',', '-and', $spacelesscity ); //for multiple cities
        $joblisting = $joblisting 
        ."<li class='job' id='".$job->slug."' data-city='".$sanitized_city."'>" 
        ."  <div class='job-header'>"
        ."    <h3 class='job-header-title'><a href='#".$job->slug."'>".$job->title."</a></h3>"
        ."    <address class='job-header-location'>".$job->city."</address>"
        ."    <div class='job-header-buttons'>"
        ."      <a class='wp-block-button__link job-header-button job-header-button-expand' href='#".$job->slug."'>Read more</a>"
        ."    </div>"
        ."  </div>"
        ."  <div class='job-content'>"
        ."    <div class='job-content-description'>"
        ."      <h4 class='job-content-title job-content-description-title'>Job description</h4>"
        .        str_replace('<br />', '', $job->description)
        ."    </div>"
        ."    <div class='job-content-requirements'>"
        ."      <h4 class='job-content-title job-content-requirements-title'>Job requirements</h4>"
        .       str_replace('<br />', '', $job->requirements)
        ."      <p style='text-align: right'><a class='wp-block-button__link job-header-button job-header-button-apply' href='".$job->careers_apply_url."' target='_blank'>Apply now</a></p>"
        ."    </div>"
        ."  </div>"
        ."</li>";
      }
      $joblisting = $joblisting."</ul>";
      return $joblisting;
    } else {
      return '<div style="margin: 1em auto; font-style: italic; text-align: center">No jobs can be found at this moment.</div>';
    }

    }
}


function create_block_formo_jobs_list_block_init() {
	register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'render_jobs_listing',
  ) );

  /**
   * Enqueue frontend and editor JavaScript and CSS
   */
}
add_action( 'init', 'create_block_formo_jobs_list_block_init' );
