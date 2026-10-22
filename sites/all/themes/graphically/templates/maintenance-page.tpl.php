<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page while offline.
 *
 * All the available variables are mirrored in html.tpl.php and page.tpl.php.
 * Some may be blank but they are provided for consistency.
 *
 * @see template_preprocess()
 * @see template_preprocess_maintenance_page()
 *
 * @ingroup themeable
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">

<head>
  <title><?php print $head_title; ?></title>
  <?php print $head; ?>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>">
  <div id="page">
    <header id="header">
      <div id="block-customization-site-name">
        <h1 id="site-name"><a href="<?php print $base_path ?>" rel="home">Graphically</a></h1>
      </div> <!-- /site-name -->

      <?php if (!empty($header)): ?>
          <?php print $header; ?>
      <?php endif; ?>
    </header> <!-- /header -->

    <div id="main">
      <?php if (!empty($sidebar)): ?>
        <aside id="sidebar" class="sidebar">
          <?php print $sidebar; ?>
        </aside> <!-- /sidebar -->
      <?php endif; ?>
      <main id="content">
        <?php if (!empty($title)): ?><h2 class="title" id="page-title"><?php print $title; ?></h2><?php endif; ?>
        <?php print $messages ? $messages : ''; ?>
        <?php print $content; ?>
      </main> <!-- /main content -->
    </div>

  </div> <!-- /page -->

</body>
</html>
