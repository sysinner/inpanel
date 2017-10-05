<div id="incp-resdomain-deploy-wizard-alert" class="alert" style="display:none"></div>

<div id="incp-resdomain-deploy-wizard"></div>

<style type="text/css">
.incp-resdomain-deployfield-boundapp-item {
  padding: 8px 6px;
  border-radius: 3px;
  border: 2px solid #eee;
  color: #000;
  cursor: pointer;
}
.incp-resdomain-deployfield-boundapp-item:hover {
  background-color: #eee;
}
</style>


<script id="incp-resdomain-deploy-wizard-tpl" type="text/html">
<div class="l4i-form-group">
  <label>Bound App Instance</label>
  <div>
    <a href="#res-domain/deploy/app-select" onclick="inCpResDomain.DeploySelectApp()"
      class="incp-resdomain-deployfield-boundapp-item" 
      style="display:flex;flex-wrap: nowrap;justify-content:space-around;align-items:center">
      <div class="incp-font-fixspace" style="flex-grow:1;order:1">
        {[=it._app_id]}
      </div>
      <div style="flex-grow:3;order:2;text-align:right">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true" 
          style="flex-grow:1;order:3">
        </span>
      </div>
    </a>
  </div>
</div>
</script>
