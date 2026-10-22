<?php

/**
 * Here we override the default HTML output of drupal.
 * refer to https://drupal.org/node/457740
 */
// Auto-rebuild the theme registry during theme development.
if (theme_get_setting('clear_registry')) {
  // Rebuild .info data.
  system_rebuild_theme_data();
  // Rebuild theme registry.
  drupal_theme_rebuild();
}

function graphically_preprocess_html(&$vars) {
  global $language;
  
  $theme_path = drupal_get_path('theme', 'graphically');
  
  $sizes = array('57x57', '114x114', '72x72', '144x144', '60x60', '120x120', '76x76', '152x152', '180x180');
  foreach ($sizes as $size) {
    drupal_add_html_head_link(array('rel' => 'apple-touch-icon', 'href' => "/$theme_path/icons/apple-touch-icon-$size.png", 'type' => 'image/png', 'sizes' => $size));
  }
  
  drupal_add_html_head_link(array('rel' => 'shortcut icon', 'href' => "/$theme_path/icons/favicon.ico", 'type' => 'image/x-icon'));
  $sizes = array('192x192', '160x160', '96x96', '16x16', '32x32');
  foreach ($sizes as $size) {
    drupal_add_html_head_link(array('rel' => 'icon', 'href' => "/$theme_path/icons/favicon-$size.png", 'type' => 'image/png', 'sizes' => $size));
  }
  
  drupal_add_html_head(array('#type' => 'html_tag', '#tag' => 'meta', '#attributes' => array('name' => 'msapplication-TileColor', 'content' => '#ffffff')), 'msapplication-TileColor');
  drupal_add_html_head(array('#type' => 'html_tag','#tag' => 'meta', '#attributes' => array('name' => 'msapplication-TileImage', 'content' => "/$theme_path/icons/mstile-144x144.png")), 'msapplication-TileImage');
  drupal_add_html_head(array('#type' => 'html_tag','#tag' => 'meta', '#attributes' => array('name' => 'msapplication-config', 'content' => "/$theme_path/icons/browserconfig.xml")), 'msapplication-config');
  drupal_add_html_head(array('#type' => 'html_tag','#tag' => 'meta', '#attributes' => array('name' => 'application-name', 'content' => "Graphically")), 'application-name');
  drupal_add_html_head(array('#type' => 'html_tag','#tag' => 'meta', '#attributes' => array('name' => 'apple-mobile-web-app-title', 'content' => "Graphically")), 'apple-mobile-web-app-title');

  // HTML Attributes
  // Use a proper attributes array for the html attributes.
  $vars['html_attributes'] = array(
    'lang' => $language->language,
    'dir' => $language->dir
  );

  // Convert RDF Namespaces into structured data using drupal_attributes.
  $vars['rdf_namespaces'] = array();
  if (function_exists('rdf_get_namespaces')) {
    foreach (rdf_get_namespaces() as $prefix => $uri) {
      $prefixes[] = $prefix . ': ' . $uri;
    }
    $vars['rdf_namespaces']['prefix'] = implode(' ', $prefixes);
  }

  // Flatten the HTML attributes and RDF namespaces arrays.
  $vars['html_attributes'] = drupal_attributes($vars['html_attributes']);
  $vars['rdf_namespaces'] = drupal_attributes($vars['rdf_namespaces']);

  if (!$vars['is_front']) {
    // Add unique classes for each page and website section
    $path = drupal_get_path_alias($_GET['q']);
    $sections = explode('/', $path);
    for ($k = 1; $k < count($sections); $k++) {
      $sections[$k] = $sections[$k - 1] . '-' . $sections[$k];
    }
    foreach ($sections as $section) {
      $vars['classes_array'][] = $section;
    }
  }
}

function graphically_preprocess_page(&$vars, $hook) {

  // Allow page override template suggestions based on node content type.
  if (isset($vars['node']->type) && isset($vars['node']->nid)) {

    if ($vars['node']->type == 'project' && !empty($vars['page']['content']['system_main']['nodes'])) {
      $vars['page']['header']['tabs'] = $vars['page']['content']['system_main']['nodes'][$vars['node']->nid]['field_pr_tabs_view'];
      hide($vars['page']['content']['system_main']['nodes'][$vars['node']->nid]['field_pr_tabs_view']);
    }

    $vars['theme_hook_suggestions'][] = 'page__' . $vars['node']->type;
    $vars['theme_hook_suggestions'][] = "page__node__" . $vars['node']->nid;
  }
}

function graphically_preprocess_node(&$vars) {
  // Add a striping class.
  $vars['classes_array'][] = 'node-' . $vars['zebra'];

  // Add $unpublished variable.
  if (!$vars['status']) {
    $vars['classes_array'][] = 'unpublished';
  }

  // Merge first/last class (from graphically_preprocess_page) into classes array of current node object.
  $node = $vars['node'];
  if (!empty($node->classes_array)) {
    $vars['classes_array'] = array_merge($vars['classes_array'],
        $node->classes_array);
  }
}

/**
 * Theme Override function of theme_menu_link.
 * To disable fake.link menu items.
 * @param array $vars
 * @return type 
 */
function graphically_menu_link(array $vars) {
  $expanded = array_search('expanded', $vars['element']['#attributes']['class']);
  if ($expanded !== false) {
    unset($vars['element']['#attributes']['class'][$expanded]);
    $vars['element']['#attributes']['class'][] = 'expandable';
    $vars['element']['#localized_options']['attributes']['class'][] = 'expandable';
  }
  if (strpos($vars['element']['#href'], 'fake.link')) {
    $vars['element']['#href'] = '';
    $vars['element']['#attributes']['class'][] = 'fake';
    $vars['element']['#localized_options']['attributes']['class'] = 'fake';
    if ($vars['element']['#original_link']['in_active_trail']) {
      $vars['element']['#localized_options']['attributes']['class'] .= ' active-trail';
    }
  }

  return theme_menu_link($vars);
}

/**
 * Preprocess function for views view.
 */
function graphically_preprocess_views_view_unformatted(&$vars) {
  $view = $vars['view'];
  $vars['description'] = false;
  if ($view->name == 'project' 
      && $view->current_display == 'columns' 
      && !empty($view->result[0]->field_field_pr_tab_desc)) {
    $vars['description'] = $view->result[0]->field_field_pr_tab_desc[0]['rendered']['#markup'];
    $vars['classes_array']['desc'] = 'views-row views-row-0 views-row-even views-row-first';
    $vars['classes_array'][0] = str_replace('views-row-first', '', $vars['classes_array'][0]);
  }
  if ($view->name == 'project' 
      && $view->current_display == 'tabs') {
    $vars['active_tab_id'] = isset($_GET['tab']) ? $_GET['tab'] : 0;
    $nid = $view->args[0];

    $active_tab = 0;
    if (!empty($view->result[$vars['active_tab_id']])) {
      $active_tab = $view->result[$vars['active_tab_id']];
    }

    $active_tab_collection = $active_tab->{'_field_data'}
        ['field_collection_item_field_data_field_pr_tab_item_id']['entity'];
    $colums = $active_tab_collection->field_pr_tab_column['und'];
    
    $size_of_columns =  sizeof($colums);
    
    if (!empty($active_tab_collection->field_pr_tab_desc)) {
      $size_of_columns++;
    }
    
    $vars['classes_array'][$vars['active_tab_id']] .= ' active';

    $vars['nav'] = array(
      '#type' => 'markup',
      '#prefix' => '<span class="nav">',
      '#suffix' => '</span>'
    );
    for ($i = 0; $i < $size_of_columns; $i++) {
      $class = array('nav-button');
      if ($i == 0) {
        $class += array('active');
      }
      $vars['nav'][$i] = array(
        '#markup' => l(t('•'), '',
            array(
          'external' => true,
          'fragment' => $i,
          'attributes' => array('class' => $class)
        )),
      );
    }
    $vars['nav'][$size_of_columns] = array(
      '#prefix' => '<span class="nav-button nav-pointer">',
      '#markup' => t('•'),
      '#suffix' => '</span>'
    );
  }
}

/**
 * Preprocess function for views view.
 */
function graphically_preprocess_views_view(&$vars) {
  $view = $vars['view'];

  if ($view->name == 'project' && $view->current_display == 'tabs') {
    $nid = $view->args[0];
    $tab_id = isset($_GET['tab']) ? $_GET['tab'] : 0;

    $vars['tab_arrows'] = array('#type' => 'markup');
    $vars['tab_arrows'] ['#prefix'] = '<div class="tab-arrows">';
    if ($tab_id > 0) {
      $vars['tab_arrows'][0] = array(
        '#type' => 'markup',
        '#markup' => l(t(' < '), 'node/' . $nid,
            array(
          'query' => array('tab' => ($tab_id - 1)),
          'attributes' => array('class' => array('tab-arrow', 'prev'))
        ))
      );
    }
    else {
      $vars['tab_arrows'][0] = array(
        '#type' => 'markup',
        '#prefix' => '<span class="tab-arrow prev disabled">',
        '#markup' => t(' < '),
        '#suffix' => '</span>',
      );
    }

    if ($tab_id < (count($view->result) - 1)) {
      $vars['tab_arrows'][1] = array(
        '#type' => 'markup',
        '#markup' => l(t(' > '), 'node/' . $nid,
            array(
          'query' => array('tab' => ($tab_id + 1)),
          'attributes' => array('class' => array('tab-arrow', 'next'))
        ))
      );
    }
    else {
      $vars['tab_arrows'][1] = array(
        '#type' => 'markup',
        '#prefix' => '<span class="tab-arrow next disabled">',
        '#markup' => t('>'),
        '#suffix' => '</span>',
      );
    }
    $vars['tab_arrows']['#suffix'] = '</div>';
  }
}
