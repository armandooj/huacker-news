var app = angular.module('huackerNews', []);

app.controller('MainCtrl', [
'$scope',
function($scope) {
    $scope.test = 'Hello World';
    $scope.posts = [
        {title: 'German government to use Trojan spyware to monitor citizens', upvotes: 5},
        {title: 'Million Dollar Curve', upvotes: 2},
        {title: 'Bill and Melinda Gates 2016 Annual Letter', upvotes: 3},
        {title: 'Why I don\'t want stuff', upvotes: 2},
        {title: 'Show HN: Windows 98 in browser', upvotes: 4}
    ];
    $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') {
            return; 
        }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0
        });
        $scope.title = '';
        $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
    }
}]);