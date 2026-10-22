<div id="page" class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if ($page['header']): ?>
    <header id="header">
      <?php print render($page['header']); ?>
      <?php if ($tabs): ?><nav class="tabs"><?php print render($tabs); ?></nav><?php endif; ?>
    </header>
  <?php endif; ?>
  <div id="main">
    <?php if ($page['sidebar']): ?>
      <aside id="sidebar">
        <?php print render($page['sidebar']); ?>
      </aside>
    <?php endif; ?> 
    <main id="content">
        <?php print $messages ? $messages : ''; ?>
        <?php print render($page['content']) ?>
    </main> 
  </div> 
  <?php if ($page['footer']): ?>
    <footer id="footer">
      <?php print render($page['footer']); ?>
    </footer> 
  <?php endif; ?>
</div>