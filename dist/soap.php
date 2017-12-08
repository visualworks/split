<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

class WebService {
  protected $url = "http://ws.globalbus.com.br/wservice.asmx?wsdl";
  protected $method = "POST";
  protected $encoding = "UTF-8";
  protected $usuario = "##########";
  protected $senha = "###########";
  
  public function __construct(){
    if(isset($_GET["op"])){
      $this->{$_GET["op"]}();
    } else {
      $client = $this->getSoapClient();
      echo json_encode($client);
      die();
    }
  }
  public function listaVeiculoGaragem(){
    $client = $this->_getSoapClient();
    $response = $client->ListaVeiculoGaragem(array("Id_Config"=>2));
    echo json_encode($response);
    die();
  }
  public function listaLinhasCliente(){
    if (isset($_GET["clientId"]) && $_GET["clientId"] > 0){
      $client = $this->_getSoapClient();
      $response = $client->ListaLinhasCliente(
        array(
          "Id_Config" => 2,
          "Cliente"   => $_GET["clientId"]
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "ID do cliente não fornecida."
        )
      );
    }
    die();
  }
  public function listaClientesPorUsuario(){
    $client = $this->_getSoapClient();
    $response = $client->ListaClientesPorUsuario(
      array(
        "Id_Config" => 2,
        "Usuario"   => $this->_getUsuario(),
        "Senha"     => $this->_getSenha()
      )
    );
    echo json_encode($response);
    die();
  }
  public function listaRotasLinha(){
    if (isset($_GET["linha"]) && $_GET["linha"] > 0){
      $client = $this->_getSoapClient();
      $response = $client->ListaRotasLinha(
        array(
          "Id_Config" => 2,
          "Linha"     => $_GET["linha"]
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "Linha não fornecida."
        )
      );
    }
    die();
  }
  public function listaPontosReferenciaRota(){
    if (isset($_GET["routeId"]) && $_GET["routeId"] > 0) {
      $client = $this->_getSoapClient();
      $response = $client->ListaPontosReferenciaRota(
        array(
          "Id_Config" => 2,
          "Rota"      => $_GET["routeId"]
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "ID da Rota não fornecida."
        )
      );
    }
    die();
  }
  public function listaTrajetosCliente(){
    if (isset($_GET["clientId"]) && $_GET["clientId"] > 0) {
      $client = $this->_getSoapClient();
      $response = $client->ListaTrajetosCliente(
        array(
          "Id_Config" => 2,
          "Cliente"   => $_GET["clientId"]
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "ID do cliente não fornecida."
        )
      );
    }
    die();
  }
  public function listaVeiculosProximos(){
    $client = $this->_getSoapClient();
    $response = $client->ListaVeiculosProximos(
      array(
        "Id_Config" => 2,
        "Latitude"  => "double",
        "Longitude" => "double"
      )
    );
    echo json_encode($response);
    die();
  }
  public function listaVeiculosEmViagem(){
    if ((isset($_GET["linha"]) && $_GET["linha"] > 0) && (isset($_GET["routeId"]) && $_GET["routeId"] > 0)) {
      $client = $this->_getSoapClient();
      $response = $client->ListaVeiculosEmViagem(
        array(
          "Id_Config" => 2,
          "Id_Linha"  => $_GET["linha"],
          "Id_Rota"   => $_GET["routeId"]
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "ID da Rota ou Linha não fornecida."
        )
      );
    }
    die();
  }
  public function listaVeiculosTrajeto(){
    if ((isset($_GET["linha"]) && $_GET["linha"] > 0) && (isset($_GET["routeId"]) && $_GET["routeId"] > 0)) {
      $client = $this->_getSoapClient();
      $response = $client->ListaVeiculosTrajeto(
        array(
          "Id_Config"         => 2,
          "Id_Linha"          => $_GET["linha"],
          "Id_Rota"           => $_GET["routeId"],
          "Latitude"          => "0",
          "Longitude"         => "0",
          "QuantidadeVeiculos"=> "100",
          "QuantidadePontos"  => "100"
        )
      );
      echo json_encode($response);
    } else {
      echo json_encode(
        array(
          "result" => "ID da Rota ou Linha não fornecida."
        )
      );
    }
    die();
  }
  private function _getSoapClient(){
    return new SoapClient($this->url, array(
        "encoding" => $this->encoding,
        "method"   => $this->method
    ));
  }
  private function _getUsuario(){
    return $this->usuario;
  }
  private function _getSenha(){
    return $this->senha;
  }
}

$webservice = new WebService();