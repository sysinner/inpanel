<div id="incp-appinst-cfg-wizard-depremotes-alert" class="alert" style="display:none"></div>

<div id="incp-appinst-cfg-wizard-depremotes"></div>

<style type="text/css">
.incp-appinst-cfgfield-boundapp-item {
  padding: 8px 6px;
  border-radius: 3px;
  border: 2px solid #eee;
  color: #000;
  cursor: pointer;
}
.incp-appinst-cfgfield-boundapp-item:hover {
  background-color: #eee;
}
</style>


<script id="incp-appinst-cfg-wizard-depremotes-tpl" type="text/html">
{[? it.dep_remotes && it.dep_remotes.length > 0]}
<div class="l4i-form-group">
  <label>Remotely dependent to AppSpec</label>
  <div class="iincp-formtable">
    <table class="incp-formtable">
    <tbody>
    {[~ it.dep_remotes :v]}
    <tr>
      <td width="200">{[=v.id]}</id>
      <td>
        <table class="iincp-formtable-space-x0050 valign-middle">
        <thead>
        <tr>
          <th>App ID</th>
          <th>Pod ID</th>
          <th></th>
        </tr>
        </thead>
        <tbody id="incp-appinst-cfg-wizard-depremotes-binds-{[=v.id]}">
        {[~ v._binds :v3]}
        {[? !v3.delete]}
        <tr class="incp-formtable-tr-line" id="incp-appinst-cfg-wizard-depremote-{[=v3.hash_id]}">
          <td class="incp-font-fixspace">{[=v3.app_id]}</td>
          <td class="incp-font-fixspace">{[=v3.pod_id]}</td>
          <td align="right">
            <button class="btn btn-sm btn-default" 
    		  onclick="inCpApp.instConfigDepRemoteDel(this, '{[=v.id]}', '{[=v3.app_id]}')">
               <i class="fa fa-times"></i>
    		</button>
    	  </td>
        </tr>
        {[?]}
        {[~]}
        </tbody>
        </table>
        <div>
          <a href="#app/inst/cfg/bound/select" onclick="inCpApp.InstConfigDepRemoteSelect('{[=v.id]}')"
            class="incp-appinst-cfgfield-boundapp-item" 
            style="display:flex;flex-wrap: nowrap;justify-content:space-around;align-items:center">
            <div class="incp-font-fixspace" style="flex-grow:1;order:1">
              Select a running AppInstance to Bind ... 
            </div>
            <div style="flex-grow:3;order:2;text-align:right">
              <span style="flex-grow:1;order:3">
                <span class="fa fa-chevron-right"></span>
              </span>
            </div>
          </tr>
          </a>
        </div>
      </td>
    </tr>
    {[~]}
	</tbody>
  </table>
</div>
{[?]}
</script>

<script id="incp-appinst-cfg-wizard-depremotes-binds-item-tpl" type="text/html">
    <tr class="incp-formtable-tr-line" id="incp-appinst-cfg-wizard-depremote-{[=it.hash_id]}">
      <td class="incp-font-fixspace">{[=it.app_id]}</td>
      <td class="incp-font-fixspace">{[=it.pod_id]}</td>
      <td align="right">
        <button class="btn btn-sm btn-default" 
		  onclick="inCpApp.instConfigDepRemoteDel(this, '{[=it.spec_id]}', '{[=it.app_id]}')">
           <i class="fa fa-times"></i>
		</button>
	  </td>
    </tr>
</script>
